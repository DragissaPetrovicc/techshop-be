const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  price: {
    required: true,
    type: Number,
  },
  image: {
    type: String,
    required: true,
  },
  name: {
    required: true,
    type: String,
  },
  specifications: [
    {
      type: Map,
      of: {
        type: String,
      },
      default: "N/A",
    },
  ],
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "ACTIVE",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
const ProductModel = mongoose.model("product", ProductSchema);

module.exports = ProductModel;
