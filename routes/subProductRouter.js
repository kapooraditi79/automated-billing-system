const express = require("express");
const router = express.Router();
const subProductModel = require("../models/subProduct-model");
const mainProductModel = require("../models/mainProduct-model");

router.get("/", function (req, res) {
  res.send("subProduct page");
});

router.post("/add", async function (req, res) {
  let subProduct = await subProductModel.findOne({ name: req.body.name });
  if (subProduct) {
    return res.status(503).send("subProduct already exists");
  } else {
    let newSubProduct = await subProductModel.create({
      name: req.body.name,
      picture: req.body.picture,
      discount: req.body.discount,
      price: req.body.price,
      mainProduct: req.body.mainProduct,
    });
    res.status(201).send(newSubProduct);
    let mainProduct = await mainProductModel.findOne({
      name: req.body.mainProduct,
    });
    mainProduct.subProducts.push(newSubProduct);
    await mainProduct.save();
  }
});

router.post("/read", async function (req, res) {
  let subProducts = await subProductModel.find();
  res.status(200).send(subProducts);
});

router.post("/delete", async function (req, res) {
  let deletedProduct = await subProductModel.findOneAndDelete({
    name: req.body.name,
  });
  res.status(200).send(deletedProduct);
  let mainProduct = await mainProductModel.findOne({
    name: req.body.mainProduct,
  });
  mainProduct.subProducts = mainProduct.subProducts.filter(function (
    subProduct
  ) {
    return !subProduct._id.equals(deletedProduct._id);
  });
  await mainProduct.save();
});

module.exports = router;
