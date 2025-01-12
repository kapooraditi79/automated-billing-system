const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/part30");

const mainProductSchema = mongoose.Schema({
  name: String,
  picture: String,
  subProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subProduct-model",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "owner-model",
  },
});

module.exports = mongoose.model("mainProduct-model", mainProductSchema);
