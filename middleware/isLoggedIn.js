const jwt = require("jsonwebtoken");
const ownerModel = require("../models/owner-model");
const dotenv = require("dotenv");
dotenv.config();
const router = require("express").Router();

module.exports = async function (req, res, next) {
  if (!req.cookies.token) {
    req.flash("error", "You must login first");
    return res.redirect("/mainProduct/read");
  }
  try {
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    let owner = await ownerModel
      .findOne({
        email: decoded.email,
      })
      .select("-password");
    req.user = owner;
    next();
  } catch (err) {
    req.flash(err);
    return res.redirect("/mainProduct/read");
  }
};
