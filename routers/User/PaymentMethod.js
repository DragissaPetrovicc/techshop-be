const express = require("express");
const Payment = require("../../models/PaymentMethod");
const { roleMiddleware } = require("../../middlewares/authentication");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PaymentMethod
 *   description: API for managing payment methods
 */

/**
 * @swagger
 * /payment/method:
 *   post:
 *     summary: Create a new payment method
 *     description: Adds a new payment method for a user.
 *     tags: [PaymentMethod]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               country:
 *                 type: string
 *                 description: User's country
 *               cardHolder:
 *                 type: string
 *                 description: Card holder's name
 *               cardInfo:
 *                 type: object
 *                 properties:
 *                   cardNumber:
 *                     type: string
 *                     description: Card number
 *                   expiring:
 *                     type: string
 *                     description: Expiration date
 *                   cvc:
 *                     type: string
 *                     description: CVC code
 *     responses:
 *       200:
 *         description: Payment method saved successfully
 *       400:
 *         description: Error creating payment method
 */
router.post("/method", roleMiddleware("USER"), async ({ body }, res) => {
  const {
    email,
    country,
    cardHolder,
    cardInfo: { cardNumber, expiring, cvc },
  } = body || {};

  try {
    if (!email)
      return res.status(400).send("Email is required so we can identify you");
    if (!country) return res.status(400).send("Country is required ");
    if (!cardHolder) return res.status(400).send("Card Holder is required ");
    if (!cardNumber) return res.status(400).send("Card number is required ");
    if (!expiring) return res.status(400).send("Expiring date is required ");
    if (!cvc) return res.status(400).send("Cvc number is required ");

    const newPayment = await Payment.create({
      email,
      country,
      cardHolder,
      cardInfo: { cardNumber, expiring, cvc },
    });

    if (!newPayment) {
      return res.status(400).send("Could not create payment method ");
    }

    res.status(200).send("Payment method saved successfully");
  } catch (e) {
    return res.status(400).send(e?.message || "Something went wrong");
  }
});

/**
 * @swagger
 * /payment/method:
 *   get:
 *     summary: Get a user's payment method
 *     description: Retrieves the payment method of a user by their email.
 *     tags: [PaymentMethod]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *     responses:
 *       200:
 *         description: Payment method retrieved successfully
 *       400:
 *         description: Error retrieving payment method
 */
router.get("/method/:id", roleMiddleware("USER"), async (req, res) => {
  const email = req.params.id;

  if (!email)
    return res.status(400).send("Email is required so we can identify you");

  try {
    const payment = await Payment.findOne({ email: email });

    if (!payment)
      return res.status(400).send("Could not find your payment method");

    return res.status(200).send(payment);
  } catch (e) {
    return res.status(400).send(e?.message || "Something went wrong");
  }
});

/**
 * @swagger
 * /payment/{id}:
 *   delete:
 *     summary: Delete a payment method by ID
 *     description: Delete a payment method by its ID.
 *     tags: [PaymentMethod]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment method ID
 *     responses:
 *       200:
 *         description: Payment method deleted successfully
 *       400:
 *         description: Error deleting payment method
 */
router.delete("/:id", roleMiddleware("USER"), async (req, res) => {
  const paymentId = req.params.id;
  if (!paymentId)
    return res
      .status(400)
      .send("You didn't provide which method you are trying to delete");

  try {
    await Payment.findByIdAndDelete(paymentId);
    return res.status(200).send("Payment method deleted successfully");
  } catch (e) {
    return res.status(400).send(e?.message || "Something went wrong");
  }
});

module.exports = router;
