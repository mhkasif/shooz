const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: "Something went wrong!",
    });
  } else {
      console.error("ERROR",err)
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
};
const handleCastErrorDB=(err)=>{
// const message=`Invalid ${err.path}: ${err.value}`
// return new AppError(message,400)
}
const handleDuplicateKeyDB=(err)=>{
//     // const value=err.message.match(/(["'])(\\?.)*?\1/)[0]
// const message=`Duplicate Field Value: ${value}. Pleasde use another value`
// return new AppError(message,400)
}
const errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
      let error={...err}
      console.log(error)
    //   if(error.kind==='ObjectId') error=handleCastErrorDB(error)
    //   if(error.code===11000) error=handleDuplicateKeyDB(error)
    sendErrorProd(error, res);
  }
};

module.exports = errorController;
