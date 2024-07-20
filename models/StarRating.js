const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  ratedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  stars: {
    type: Number,
    required: true,
  },
  ratedAt: {
    type: Date,
    default: Date.now,
  },
});

const RatingModel = mongoose.model("rating", ratingSchema);

module.exports = RatingModel;
