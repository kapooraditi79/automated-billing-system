const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/part30");

const subProductSchema = mongoose.Schema({
  name: String,
  price: Number,
  picture: String,
  mainProduct: {
    type: mongoose.Schema.Types.String,
    ref: "mainProduct-model",
  },
  discount: Number,
});

module.exports = mongoose.model("subProduct-model", subProductSchema);
