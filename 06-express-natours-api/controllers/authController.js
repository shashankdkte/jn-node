const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET), {
    expiresIn:process.env.JWT_EXPIRES_IN
  }
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
    data: {
      user
    }
  })
})