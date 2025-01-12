const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/part30");

const randomSchema = mongoose.Schema({
  subProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subProduct-model",
    },
  ],
});

module.exports = mongoose.model("random-model", randomSchema);
