const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");
const mainProductModel = require("../models/mainProduct-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

require("dotenv").config();

const cookieParser = require("cookie-parser");
const path = require("path");

router.use(cookieParser());
router.use(express.static(path.join(__dirname, "public")));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", function (req, res) {
  res.render("ownerLogin");
});

if (process.env.NODE_ENV === "development") {
  router.post("/create", async function (req, res) {
    let owner = await ownerModel.findOne();
    if (owner) {
      return res.status(503).send(owner);
    } else {
      bcrypt.genSalt(10, async function (err, salt) {
        bcrypt.hash(req.body.password, salt, async function (err, hash) {
          let owner = await ownerModel.create({
            fullName: req.body.password,
            email: req.body.email,
            password: hash,
            gstin: req.body.gstin,
          });
          let token = generateToken(owner);

          let mainProducts = await mainProductModel.find();
          if (mainProducts.length > 0) {
            owner.mainProducts.push(...mainProducts);
          }
          res.cookie("token", token);
          res.send(owner);
        });
      });
    }
  });

  router.get("/read", async function (req, res) {
    let owner = await ownerModel.find();
    res.status(200).send(owner);
  });
}

router.post("/login", async function (req, res) {
  try {
    let loggedInOwner = await ownerModel.findOne({ email: req.body.email });
    if (!loggedInOwner) {
      return res.status(503).send("Invalid Credentials");
    }
    bcrypt.compare(
      req.body.password,
      loggedInOwner.password,
      function (err, result) {
        if (result) {
          let token = generateToken(loggedInOwner);
          res.cookie("token", token);
          res.send("Hello, " + loggedInOwner.fullName);
        } else {
          res.send("Invalid Credentials");
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
});

//creaing isLoggedIn Middleware

module.exports = router;
