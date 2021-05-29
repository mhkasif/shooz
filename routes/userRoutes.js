const express =require('express');
// const { router } = require('../app');
const { signUp,login, forgotPassword, resetPassword } = require('../controller/authController');

const userRouter=express.Router()
userRouter.post('/signup',signUp )
userRouter.post('/login',login  )
userRouter.post('/forgotPassword',forgotPassword  )
userRouter.post('/resetPassword/:token',resetPassword )


// userRouter.route('/signup').post(signUp)

module.exports=userRouter