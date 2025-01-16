const express = require("express");
const router = express.Router();
const randomModel = require("../models/random-model");
const subProductModel = require("../models/subProduct-model");
const mainProductModel = require("../models/mainProduct-model");
const mongoose = require("mongoose");

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

router.post("/addToCart", async function (req, res) {
  const subProductId = req.body.subProduct;
  if (!mongoose.Types.ObjectId.isValid(subProductId)) {
    return res.status(400).send("Invalid subProduct ID");
  }
  let item = await subProductModel.findById(subProductId);
  let random = await randomModel.findOne();
  if (!random) {
    random = new randomModel({ subProducts: [], quantity: 0 });
  }
  let subProductInCart = await random.subProducts.find(function (sub) {
    return sub.product.toString() === subProductId;
  });

  if (subProductInCart) {
    subProductInCart.quantity += 1;
  } else {
    await random.subProducts.push({ product: item._id, quantity: 1 });
  }
  await random.save();
  // res.redirect("addToCart", { subProducts: random.subProducts });
  res.json({ success: true, subProducts: random.subProducts });
});

router.get("/addToCart", async function (req, res) {
  let random = await randomModel.findOne();
  if (!random) {
    return res.status(404).send("Cart not found");
  }
  res.render("addToCart", {
    subProducts: random.subProducts,
  });
});

//you match the subProductId with the unique id of the subProduct in the cart
//because every time the same product is added, mongoDb assigns
//the same unique_id to that subProduct rather than a new one
//since each subPrroduct has 3 features assigned to it
//the unique_id, the product and the quantity
router.post("/deleteFromCart", async function (req, res) {
  const subProductId = req.body.subProduct;
  let random = await randomModel.findOne();
  if (!random) {
    return res.status(404).send("Cart not found");
  }
  let subProductInCart = await random.subProducts.find(function (sub) {
    return sub._id.toString() === subProductId;
  });

  if (subProductInCart.quantity > 1) {
    subProductInCart.quantity -= 1;
  } else {
    random.subProducts = random.subProducts.filter(function (subProduct) {
      return !(subProduct._id.toString() === subProductId);
    });
  }
  await random.save();
  res.json({ success: true, subProducts: random.subProducts });
});

router.get("/deleteFromCart", async function (req, res) {
  let random = await randomModel.findOne();
  if (!random) {
    return res.status(404).send("Cart not found");
  }
  res.render("addToCart", {
    subProducts: random.subProducts,
  });
});

module.exports = router;
