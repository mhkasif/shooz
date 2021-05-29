const User = require("../models/userModel");
const AppError = require("../utils/appError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((x) => {
    if (allowedFields.includes(x)) newObj[x] = obj[x];
  });
  return newObj;
};
const updateCurrentUser = async (req, res, next) => {
  if (req.body.password || req.body.currentPassword) {
    return next(new AppError("This route is not for password updates !", 400));
  }

  const filteredBody = filterObj(req.body, "name", "displayPhoto");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  console.log(req.user);
  res.status(200).json({
    status: "success",
    user: updatedUser,
  });
};
const deleteCurrentUser=async(req,res,next)=>{
    await User.findByIdAndUpdate( req.user.id,{active:false})
    res.status(200).json({
        status: "success",
        token:null
      });
}
module.exports = {
  updateCurrentUser,
  deleteCurrentUser
};
