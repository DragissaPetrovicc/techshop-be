const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  cardHolder: {
    required: true,

    type: String,
  },

  cardInfo: {
    cardNumber: {
      required: true,

      type: Number,
      unique: true,
    },

    expiring: {
      required: true,

      type: String,
    },

    cvc: {
      required: true,

      type: Number,
    },
  },

  timesUsed: {
    type: Number,
    default: 0,
  },
});

const PaymentMethod = mongoose.model("payment", PaymentSchema);

module.exports = PaymentMethod;
