const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "USER",
  },
  image: {
    type: String,
    default:
      "https://www.pngitem.com/pimgs/m/524-5246388_anonymous-user-hd-png-download.png",
  },
  verification: {
    type: Boolean,
    default: false,
  },
  rated: {
    type: Boolean,
    default: false,
  },
  location: {
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
});

const userModel = mongoose.model("User", UserSchema);

module.exports = userModel;
