const express = require("express");
const router = express.Router();
const randomModel = require("../models/random-model");
const subProductModel = require("../models/subProduct-model");
const mainProductModel = require("../models/mainProduct-model");

require("dotenv").config();

router.get("/", async function (req, res) {
  let products = await mainProductModel.find();
  res.render("index", { products: products });
});

router.get("/subProducts", async function (req, res) {
  try {
    let subProducts = await subProductModel.find({
      mainProduct: req.query.mainProduct,
    });
    res.render("subProducts", { subProducts: subProducts });
  } catch (error) {
    console.log(error);
  }
});

router.get("/addToCart", async function (req, res) {
  let item = await subProductModel.findOne({ _id: req.query.subProduct });
  let random = await randomModel.findOne();
  if (!random) {
    random = new randomModel({ subProducts: [] });
  }
  random.subProducts.push(item);
  await random.save();
  console.log(random.subProducts);
});

router.get("/deleteFromCart", async function (req, res) {
  let item = await subProductModel.findOne({ _id: req.query.subProduct });
  let random = await randomModel.findOne();
  random.subProducts = random.subProducts.filter(function (subProduct) {
    return !subProduct._id.equals(item._id);
  });
  await random.save();
  console.log(random.subProducts);
});

module.exports = router;
