const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const filterObj = (obj, ...allowedFields) =>
  {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj;
  }
exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'fail',
    data: 'Not available',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    data: 'Not available',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    data: 'Not available',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    data: 'Not available',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    data: 'Not available',
  });
};

exports.updateMe = catchAsync( async(req, res) => {
  
  // 1) Create error if user posts password
  if (req.body.password || req.body.passwordConfirm)
  {
    return next(new AppError("This route is not for updating passwords Please use /updateMyPassword"));
  }
  
  // 2) Filtered out unwanted field names that are not allowed to be updated

  const filterBody = filterObj(req.body, 'name', 'email');


  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filterBody, {
    new: true,
    runValidators:true
  })

  res.status(200).json({
    status: "success",
    data: {
      user:updatedUser
    }
  })
})

exports.deleteMe = catchAsync(async (req, res) => {

  await User.findByIdAndDelete(req.user._id, { active: false });

  res.status(204).json({
    status: "success",
    data:null
  })
})