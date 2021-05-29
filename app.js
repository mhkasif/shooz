const express = require("express");
const ExpressMongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const errorController = require("./controller/errorController");
const app = express();
const shoesRouter = require("./routes/shoesRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const xss=require('xss-clean');
const hpp = require("hpp");
// const exphbs=require('express-handlebars')
// const nodemailer=require('nodemailer')


//view engine setup
// app.engine('handlebars',exphbs())
// app.set('view engine','handlebars')

//middlewares

const limiter=rateLimit({
  max:100,
  windowMs:10*60*1000,
  message:'Too many request from this ip,please try again after 10 minutes'

})
//set secure http headers
app.use(helmet())

//limit req per ip
app.use('/api',limiter)
//body to be of max 10kb
app.use(express.json({limit:'10kb'}));

//data sanitization against NOSQL query injection
app.use(ExpressMongoSanitize())

//data sanitization against Xss
app.use(xss())
//remove the duplicate parameter
app.use(hpp())

app.use("/api/v1/users", userRouter);
app.use("/api/v1/shoes", shoesRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 400));
});
app.use(errorController);
module.exports = app;
