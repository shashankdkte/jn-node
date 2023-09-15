const { promisify } = require("util");
const crypto = require("crypto");
const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const sendEmail = require("./../utils/email");
const jwt = require("jsonwebtoken");
const { create } = require("domain");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn:process.env.JWT_EXPIRES_IN
  })
}

exports.createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // Remove password from output

  const cookieOptions = {
    expiresIn: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly:true
  }
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn:process.env.JWT_EXPIRES_IN
  // })
  const token = signToken(newUser._id);
 this.createSendToken(newUser, 201, res);
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);

  // 1) Check if email and password exist
  if (!email || !password)
  {
    return next(new AppError("Please provide email and password!", 400));
  }
  
  //2) Check if user exist and password is correct

  const user = await User.findOne({ email }).select('+password');
  if (!user || ! await user.correctPassword(password, user.password))
  {
    return next(new AppError("Incorrect email or password"));

  }
  
 // 3) If everything ok, send token to client
  this.createSendToken(user, 200, res);
})

exports.protect = catchAsync(async (req, res, next) => {
  
  //1) Getting token and check it
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
  {
    token = req.headers.authorization.split(" ")[1];

  }

  if (!token)
  {
    
    return next(new AppError("You are not logged in ! Please log into to access", 401))
  }

  // 2) Verification Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check if user still exists

  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
  {
    return next(new AppError("This user belonging to this token does not longer exist",401))
    }
  // 4)Check if user changed password after token was issued

  if (currentUser.changePasswordAfter(decoded.iat))
  {
    return next(new AppError("User recently changed password! Please log in again"))
  }

  // GRANT ACCESS TO PROTECTED ROUTE

  req.user = currentUser;
  next();
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    
    if (!roles.includes(req.user.role))
    {
      return next(new AppError("You do not have the permission to perform this action"));
    }
    next();
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
  {
    return next(new AppError("There is no user with email Address",404 ))
  }
  
  //Generate token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

   // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
})


exports.resetPassword = catchAsync ( async(req, res, next) => {
  
  // 1) Get user based on token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({passwordResetToken:hashedToken, passwordResetExpires:{$gt:Date.now()}})

  // 2) If token has not expired, and there is user, set the new password
  if (!user)
  {
    return next(new AppError("Token is invalid or has expired", 400));

  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  const token = signToken(user._id);
 // 4) Log the user in, send JWT
  this.createSendToken(user, 200, res);
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  
  // 1) Get user form collection

  const user = await User.findById(req.user._id).select('+password');

  // 2) Check if posted current password is correct
  if (! await user.correctPassword(req.body.passwordCurrent, user.password))
  {
    return next(new AppError("Your current password is wrong", 401));
  }
  
  // 3) If so update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  this.createSendToken(user, 200, res);
})