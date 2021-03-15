const express=require('express');
const app=express()
const shoozRouter = require('./routes/shoozRoutes');
const userRouter = require('./routes/userRoutes');

//middlewares
app.use(express.json())
app.use('/api/v1/shooz',shoozRouter)
app.use('/api/v1/users',userRouter)

module.exports=app










