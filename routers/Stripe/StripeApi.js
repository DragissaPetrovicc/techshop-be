const express = require("express");
const { config } = require("dotenv");
const { roleMiddleware } = require("../../middlewares/authentication");
config();
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stripe Purchase
 *   description: Operations related to purchasing products using Stripe
 */

/**
 * @swagger
 * /purchase/pay:
 *   post:
 *     summary: Create a payment session
 *     description: Creates a payment session for purchasing products using Stripe.
 *     tags: [Stripe Purchase]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     image:
 *                       type: array
 *                       items:
 *                         type: string
 *                     price:
 *                       type: number
 *                     quantity:
 *                       type: integer
 *             example:
 *               products:
 *                 - name: Product 1
 *                   image: ["url1", "url2"]
 *                   price: 10.5
 *                   quantity: 2
 *     responses:
 *       200:
 *         description: Payment session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID of the created payment session
 *       400:
 *         description: Error creating payment session
 */
router.post("/pay", roleMiddleware("USER"), async ({ body }, res) => {
  const { products } = body || {};
  if (!products || products.length === 0) {
    return res.status(400).send("There are no products to buy");
  }

  try {
    const items = products.map((product) => ({
      quantity: product.quantity || 1,
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: product.price,
      },
    }));

    const success_url = "http://localhost:3000/success";
    const cancel_url = "http://localhost:3000/cancel";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items,
      mode: "payment",
      success_url,
      cancel_url,
    });

    return res.status(200).send({ id: session.id });
  } catch (e) {
    console.error(e);
    return res
      .status(400)
      .send(e?.message || "Couldn't make payment, try again");
  }
});

module.exports = router;
