const mongoose = require("mongoose");
const config = require("config");
const dbgr = require("debug")("development:mongoD");

mongoose
  .connect(`${config.get("MONGODB_URI")}/part30`)
  .then(function () {
    dbgr("connected");
  })
  .catch(function (err) {});

module.exports = mongoose.connection;
