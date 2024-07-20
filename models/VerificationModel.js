const mongoose = require("mongoose");

const VerifySchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  code: {
    type: String,
  },
});
const VerifyModel = mongoose.model("verification", VerifySchema);

module.exports = VerifyModel;
