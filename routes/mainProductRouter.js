const express = require("express");
const router = express.Router();
const mainProductModel = require("../models/mainProduct-model");
const ownerModel = require("../models/owner-model");

router.get("/", function (req, res) {
  res.send("mainProduct page");
});

router.post("/add", async function (req, res) {
  let product = await mainProductModel.findOne({ name: req.body.name });
  if (product) {
    return res.status(503).send(product);
  } else {
    let newProduct = await mainProductModel.create({
      name: req.body.name,
      picture: req.body.picture,
    });
    let owner = await ownerModel.findOne();
    owner.mainProducts.push(newProduct);
    await owner.save();
    return res.status(201).send(newProduct);
  }
});

router.get("/read", async function (req, res) {
  let products = await mainProductModel.find();
  res.status(200).send(products);
});

router.post("/delete", async function (req, res) {
  let deletedProduct = await mainProductModel.findOneAndDelete({
    name: req.body.name,
    picture: req.body.picture,
  });
  res.status(200).send(deletedProduct);
  let owner = await ownerModel.findOne();
  owner.mainProducts = owner.mainProducts.filter(function (product) {
    return !product._id.equals(deletedProduct._id);
  });
  await owner.save();
});

router.post("/update", async function (req, res) {
  let product = await mainProductModel.findOne({ name: req.body.name });
  if (!product) {
    return res.status(404).send("Product not found");
  } else {
    let updatedProduct = await mainProductModel.findOneAndUpdate(
      { name: req.body.name },
      { picture: req.body.picture }
    );
    res.status(200).send(updatedProduct);

    let updatedMainProducts = await ownerModel.updateOne(
      { "mainProducts._id": product._id },
      {
        $set: {
          "mainProducts.$.picture": req.body.picture,
          "mainProducts.$.name": req.body.name,
        },
      }
    );
    await updatedMainProducts.save();
    await ownerModel.save();
  }
});

module.exports = router;
