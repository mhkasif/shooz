const express = require("express");
const errorController = require("./controller/errorController");
const app = express();
const shoesRouter = require("./routes/shoesRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
// const exphbs=require('express-handlebars')
// const nodemailer=require('nodemailer')


//view engine setup
// app.engine('handlebars',exphbs())
// app.set('view engine','handlebars')

//middlewares
app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/shoes", shoesRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 400));
});
app.use(errorController);
module.exports = app;
