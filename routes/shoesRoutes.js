const express = require("express");
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
shoesRouter.route("/:id").get(getShoes).patch(updateShoes).delete(deleteShoes);
module.exports = shoesRouter;
