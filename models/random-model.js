const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/part30");

const randomSchema = mongoose.Schema({
  subProducts: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subProduct-model",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

module.exports = mongoose.model("random-model", randomSchema);
