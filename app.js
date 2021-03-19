const express = require("express");
const errorController = require("./controller/errorController");
const app = express();
const shoesRouter = require("./routes/shoesRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");

//middlewares
app.use(express.json());
app.use("/api/v1/shoes", shoesRouter);
app.use("/api/v1/users", userRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 400));
});
app.use(errorController);
module.exports = app;
