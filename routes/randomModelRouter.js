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
    console.log(subProducts);
    res.render("subProducts", { subProducts: subProducts });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
