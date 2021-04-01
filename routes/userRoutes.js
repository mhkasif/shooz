const express =require('express');
// const { router } = require('../app');
const { signUp,login } = require('../controller/authController');

const userRouter=express.Router()
userRouter.post('/signup',signUp )
userRouter.post('/login',login  )

// userRouter.route('/signup').post(signUp)

module.exports=userRouter