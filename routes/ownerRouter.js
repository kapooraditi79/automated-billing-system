const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");
const mainProductModel = require("../models/mainProduct-model");

require("dotenv").config();

router.get("/", function (req, res) {
  res.send("Owner Router");
});

if (process.env.NODE_ENV === "development") {
  router.post("/create", async function (req, res) {
    let owner = await ownerModel.findOne();
    if (owner.length > 0) {
      return res.status(503).send(owner);
    } else {
      let newOwner = await ownerModel.create({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        gstin: req.body.gstin,
      });
      res.status(201).send(newOwner);
    }
  });
  router.get("/read", async function (req, res) {
    let owner = await ownerModel.find();
    res.status(200).send(owner);
  });
}

module.exports = router;
