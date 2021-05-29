const crypto=require('crypto')
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const sendEmail = require("../utils/email");

const signToken = async (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = await signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!(await user.correctPassword(password, user.password)) || !user) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = await signToken(user._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];
  if (!token)
    return next(
      new AppError("You're not logged in,Please log in to get access", 401)
    );
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    return next(
      new AppError("The user belonging to this token no longer exist")
    );
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! please login again")
    );
  }
  req.user = freshUser;
  next();
});
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You don't have a permission to perform this action", 403)
      );
    next();
  };
};

const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    next(new AppError("No user exist with this email", 404));
  }
  const resetToken = await user.createPasswordResetToken();
  await user.save({validateBeforeSave:false}); //to save expiry date in usermodel

  //send email
const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`
 const message=`Forgot your password? Submit a patch request with your new password and confirm to ${resetUrl}.\n If you didn't forget your password, please ignore this email!`
 try {
  await sendEmail({
    email:user.email,
    subject:'Reset password',
    message,

  })
  res.status(200).json({
    status:"success",
    message:"Token has been sent to your email"
  })
 } catch (error) {
   user.passowrdResetToken=undefined;
   user.passworkResetExpires=undefined
   await user.save({validateBeforeSave:false});
   return next(new AppError("There was an error in sending email, Try Again!",500))
 }

});
const resetPassword = catchAsync(async (req, res, next) => {
  console.log(req.params)
  const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex')
  console.log(hashedToken)
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },

  });
  console.log(user)
  if(!user){
    return next(new AppError('Token is invalid or expired',400 ))
  }

  user.password=req.body.password
  user.confirmPassword=req.body.confirmPassword
  user.passwordResetToken=undefined
  user.passwordResetExpires=undefined
  await user.save()

  const token=await signToken(user._id)
  res.status(200).json({
    status:'success',
    token
  })
});
module.exports = {
  signUp,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
};
