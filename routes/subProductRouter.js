const express = require("express");
const router = express.Router();
const subProductModel = require("../models/subProduct-model");
const mainProductModel = require("../models/mainProduct-model");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", function (req, res) {
  res.send("subProduct page");
});

router.post("/add", isLoggedIn, async function (req, res) {
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

router.post("/delete", isLoggedIn, async function (req, res) {
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

router.post("/update", isLoggedIn, async function (req, res) {
  let subProduct = await subProductModel.findOne({ name: req.body.name });
  if (!subProduct) {
    return res.status(404).send("subProduct Not found");
  } else {
    let updatedSubProduct = await subProductModel.findOneAndUpdate(
      { name: req.body.name },
      {
        price: req.body.price,
        picture: req.body.picture,
        discount: req.body.discount,
        mainProduct: req.body.mainProduct,
      },
      { new: true }
    );
    res.status(200).send(updatedSubProduct);
    let mainProduct = await mainProductModel.findOne({
      name: req.body.mainProduct,
    });
    let updatedSubProducts = await mainProductModel.updateOne(
      { "subProducts._id": subProduct._id },
      {
        $set: {
          "subProducts.$.name": req.body.name,
          "subProducts.$.price": req.body.price,
          "subProducts.$.picture": req.body.picture,
          "subProducts.$.discount": req.body.discount,
          "subProducts.$.mainProduct": req.body.mainProduct,
        },
      }
    );
    await updatedSubProducts.save();
    await mainProduct.save();
  }
});

module.exports = router;
