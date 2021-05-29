const express = require("express");
const { protect } = require("../controller/authController");
const {
  getAllShoes,
  addShoes,
  getShoes,
  updateShoes,
  deleteShoes,
  aliasTopRatedShoes,
} = require("../controller/shoesController");

const shoesRouter = express.Router();
shoesRouter.route("/").get(getAllShoes).post(addShoes);
shoesRouter.route("/top-rated-shoes").get(aliasTopRatedShoes, getAllShoes);
shoesRouter.route("/:id").get(getShoes).patch(updateShoes).delete(protect,deleteShoes);
module.exports = shoesRouter;
