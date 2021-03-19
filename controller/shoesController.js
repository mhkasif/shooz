const { Shoes } = require("../models/shoesModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getAllShoes = catchAsync(async (req, res,next) => {
  let features = new APIFeatures(Shoes.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const shoes = await features.query;
  console.log(shoes)
  res.status(201).json({
    status: "success",
    results: shoes.length,
    data: {
      shoes: shoes,
    },
  });
});
const getShoes = catchAsync(async (req, res,next) => {
  const shoes = await Shoes.findById(req.params.id);
console.log(shoes);


  if(!shoes){
    return next(new AppError("No shoe found with this id",404))
  }

  res.status(201).json({
    status: "success",
    data: {
      shoes: shoes,
    },
  });
});
const updateShoes = catchAsync(async (req, res,next) => {
  const shoes = await Shoes.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if(!shoes){
    return next(new AppError("No shoe found with this id",404))
  }
  res.status(201).json({
    status: "success",
    data: {
      shoes: shoes,
    },
  });
});
const deleteShoes = catchAsync(async (req, res,next) => {
  const shoes=await Shoes.findByIdAndDelete(req.params.id);
  if(!shoes){
    return next(new AppError("No shoe found with this id",404))
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

const addShoes = catchAsync(async (req, res, next) => {
  const newShoes = await Shoes.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      shoes: newShoes,
    },
  });
});

//middlewares
const aliasTopRatedShoes = async (req, res, next) => {
  req.query.limit = 3;
  req.query.sort = "-ratingsAverage,-ratingsQuantity,price";
  next();
};
module.exports = {
  getAllShoes,
  addShoes,
  getShoes,
  updateShoes,
  deleteShoes,
  aliasTopRatedShoes,
};
