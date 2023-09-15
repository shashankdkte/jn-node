const {promisify} = require("util")
const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn:process.env.JWT_EXPIRES_IN
  })
}
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn:process.env.JWT_EXPIRES_IN
  // })
  const token = signToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user:newUser
    }
  })
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
  
  // 3) Return token
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
   
  })
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
  const resetToken = user.createPasswordToken();
  await user.save({validateBeforeSave:false})
})