const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/part30");

const ownerSchema = mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  mainProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mainProduct-model",
    },
  ],
  gstin: String,
});

module.exports = mongoose.model("owner-model", ownerSchema);
