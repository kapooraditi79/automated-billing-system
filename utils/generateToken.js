const jwt = require("jsonwebtoken");

const generateToken = function (owner) {
  return jwt.sign({ email: owner.email, id: owner._id }, process.env.JWT_KEY);
};
//this returns a token. To be setup in the owners browser
//for him/her to interact with the server
module.exports.generateToken = generateToken;
