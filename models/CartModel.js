const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "product",
    },
  ],
  name: {
    type: String,
    required: true,
  },
  lastEdited: {
    type: String,
    default: Date.now,
  },
});

const CartModel = mongoose.model("cart", CartSchema);

module.exports = CartModel;
