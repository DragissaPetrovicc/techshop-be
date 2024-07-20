const mongoose = require("mongoose");

const RepArticleModel = mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  reportedArticle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  additionalMessage: {
    type: String,
    default: "N/A",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ReportArticle = mongoose.model("ReportArticle", RepArticleModel);

module.exports = ReportArticle;
