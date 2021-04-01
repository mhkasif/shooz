const mongoose = require("mongoose");
const { default: validator } = require("validator");
const bcrypt = require("bcryptjs");

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

  password: {
    type: String,
    required: [true, "please provide a password"],
    minlength: 8,
    select:false
  },
  confirmPassword: {
    type: String,
    select:false,
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
  passwordChangedAt:Date
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
  return await bcrypt.compare(candidatePassword,userPassword)
}
userSchema.methods.changePasswordAfter=async function(JWTTimestamp){
if(this.passwordChangedAt){
  const changeTimestamp=parseInt(this.passwordChangedAt.getTime()/1000)
  return  JWTTimestamp<changeTimestamp
}

//FALSE means password was not changed before issuing token
  return false
}
const User = mongoose.model("User", userSchema);
module.exports = User;
