const express =require('express');
// const { router } = require('../app');
const { signUp,login, forgotPassword, resetPassword,updatePassword ,protect} = require('../controller/authController');
const { updateCurrentUser, deleteCurrentUser } = require('../controller/userController');

const userRouter=express.Router()
userRouter.post('/signup',signUp )
userRouter.post('/login',login  )
userRouter.post('/forgotPassword',forgotPassword  )
userRouter.patch('/resetPassword/:token',resetPassword )
userRouter.patch('/updatePassword',protect,updatePassword)
userRouter.patch('/updateCurrentUser',protect,updateCurrentUser)
userRouter.delete('/deleteCurrentUser',protect,deleteCurrentUser)


// userRouter.route('/signup').post(signUp)

module.exports=userRouter