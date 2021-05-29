const mongoose = require("mongoose");
const { default: validator } = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please enter your email address"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    select: false,
    required: [true, "please Confirm your password"],
    validate: {
      //this will work only on creation not updation
      validator: function (el) {
        return el === this.password;
      },
      message: "Password doesn't match",
    },
  },
  displayPhoto: {
    type: String,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changePasswordAfter = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changeTimestamp;
  }

  //FALSE means password was not changed before issuing token
  return false;
};
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken=crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires=Date.now()+10*60*1000
  return resetToken
};
const User = mongoose.model("User", userSchema);
module.exports = User;
