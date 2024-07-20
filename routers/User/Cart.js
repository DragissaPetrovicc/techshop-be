const express = require("express");
const User = require("../../models/UserModel");
const Cart = require("../../models/CartModel");
const { roleMiddleware } = require("../../middlewares/authentication");

const router = express.Router();

/**
 * @swagger
 * /cart/make:
 *   post:
 *     summary: Create a new cart
 *     description: Create a new cart with specified owner, products, and name.
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               owner:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cart created successfully
 *       400:
 *         description: Error creating cart
 */
router.post("/make", roleMiddleware("USER"), async ({ body }, res) => {
  const { owner, products, name } = body || {};

  if (!owner)
    return res
      .status(400)
      .send("Couldn't identify you,make sure you are logged in");
  if (products.length === 0) {
    return res.status(400).send("Couldn't make cart with 0 products");
  }
  if (!name) return res.status(400).send("Cart name is required");

  try {
    const user = await User.findById(owner);
    if (!user) return res.status(400).send("Provided user doesn't exist");

    const cart = await Cart.create({ owner, products, name });

    if (!cart)
      return res
        .status(400)
        .send("Something went wrong, couldn't make new cart");

    return res.status(200).send("Cart made successfully");
  } catch (e) {
    return res.status(400).send(e?.message || "Something went wrong,try again");
  }
});

/**
 * @swagger
 * /cart/{id}:
 *   patch:
 *     summary: Update an existing cart by ID
 *     description: Update the products or name of an existing cart by its ID.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart ID
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
 *                   type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       400:
 *         description: Error updating cart
 */
router.patch("/:id", roleMiddleware("USER"), async (req, res) => {
  const cartId = req.params.id;
  const { products, name } = req.body;

  if (!products && !name) return res.status(400).send("All fields are empty");

  if (!cartId) return res.status(400).send("Couldn't find specified cart");

  try {
    const cart = await Cart.findByIdAndUpdate(
      cartId,
      { products, name, lastEdited: Date.now() },
      { new: true }
    );
    if (!cart) return res.status(400).send("Couldn't update this cart");

    return res.status(200).send("Cart successfully updated");
  } catch (e) {
    return res.status(400).send(e?.message || "Something went wrong,try again");
  }
});

/**
 * @swagger
 * /cart/all:
 *   get:
 *     summary: Get all carts for a user
 *     description: Retrieve all carts associated with a specified user ID.
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Carts retrieved successfully
 *       400:
 *         description: Error retrieving carts
 */
router.get("/all/:id", roleMiddleware("USER"), async (req, res) => {
  const userId = req.params.id;
  if (!userId) return res.status(400).send("You are not logged in");

  try {
    const carts = await Cart.find({ owner: userId }).populate("owner");
    if (!carts) return res.status(400).send("You still didn't make any cart");

    return res.status(200).send(carts);
  } catch (e) {
    return res.status(400).send(e?.message || "Something went wrong,try again");
  }
});

/**
 * @swagger
 * /cart/{id}:
 *   get:
 *     summary: Get a cart by ID
 *     description: Retrieve a cart by its ID.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       400:
 *         description: Error retrieving cart
 */
router.get("/:id", roleMiddleware("USER"), async (req, res) => {
  const id = req.params.id || {};
  if (!id) {
    return res
      .status(400)
      .send("You didn't specify which cart you are trying to get");
  }

  try {
    const cart = await Cart.findById(id).populate({
      path: "products",
      model: "product",
    });

    if (!cart) {
      return res.status(400).send("Specified cart doesn't exist");
    }

    return res.status(200).send(cart);
  } catch (e) {
    return res
      .status(400)
      .send(e?.message || "Something went wrong, try again");
  }
});

/**
 * @swagger
 * /cart/{id}/addProduct:
 *   put:
 *     summary: Add a product to a cart
 *     description: Add a product to an existing cart by its ID.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       400:
 *         description: Error adding product to cart
 */
router.put("/:id/addProduct", roleMiddleware("USER"), async (req, res) => {
  const cartId = req.params.id;
  const { productId } = req.body || {};

  if (!cartId)
    return res.status(400).send("You didn't provide what cart you are using");
  if (!productId)
    return res
      .status(400)
      .send("You didn't provide what product you are adding to cart");

  try {
    const cart = await Cart.findByIdAndUpdate(
      cartId,
      { $push: { products: productId } },
      { new: true }
    );
    if (!cart) return res.status(400).send("Couldn't add product to this cart");

    return res.status(200).send("Product added in cart successfully ");
  } catch (e) {
    return res
      .status(400)
      .send(e?.message || "Something went wrong, try again");
  }
});

/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Delete a cart by ID
 *     description: Delete a cart by its ID.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *       400:
 *         description: Error deleting cart
 */
router.delete("/:id", roleMiddleware("USER"), async (req, res) => {
  const cartId = req.params.id;
  if (!cartId)
    return res
      .status(400)
      .send("You didn't provide which cart you want to delete");

  try {
    await Cart.findByIdAndDelete(cartId);

    return res.status(200).send("Cart deleted successfully");
  } catch (e) {
    return res
      .status(400)
      .send(e?.message || "Something went wrong, try again");
  }
});

module.exports = router;
