const express = require("express");
const User = require("../../models/UserModel");
const Product = require("../../models/ProductModel");
const { roleMiddleware } = require("../../middlewares/authentication");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ManipulateProducts
 *   description: API for managing products
 */

/**
 * @swagger
 * /products/add:
 *   post:
 *     summary: Add a new product
 *     description: Creates a new product.
 *     tags: [ManipulateProducts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               owner:
 *                 type: string
 *                 description: Owner ID
 *               price:
 *                 type: number
 *                 description: Product price
 *               image:
 *                 type: string
 *                 description: Product image URL
 *               name:
 *                 type: string
 *                 description: Product name
 *               specifications:
 *                 type: object
 *                 description: Product specifications
 *               description:
 *                 type: string
 *                 description: Product description
 *               quantity:
 *                 type: number
 *                 description: Product quantity
 *     responses:
 *       200:
 *         description: Product created successfully
 *       400:
 *         description: Error creating product
 */

router.patch("/paymentMade", roleMiddleware("USER"), async ({ body }, res) => {
  const { products } = body || {};
  if (!products) return res.status(400).send("Products are required");

  try {
    for (const productId of products) {
      const product = await Product.findById(productId);
      if (!product)
        return res
          .status(400)
          .send(`Couldn't find product with id: ${productId}`);

      product.quantity -= 1;
      await product.save();
    }

    return res
      .status(200)
      .send("Quantity for all products you sent decreased by 1");
  } catch (e) {
    return res.status(400).send("Something went wrong");
  }
});

router.post("/add", roleMiddleware("USER"), async ({ body }, res) => {
  const { owner, price, image, name, specifications, description, quantity } =
    body || {};

  if (!owner)
    return res
      .status(400)
      .send("Owner not provided, make sure you are logged in");
  if (!price) return res.status(400).send("Product price is required");
  if (!image) return res.status(400).send("Product image is required");
  if (!name) return res.status(400).send("Product name is required");
  if (!description)
    return res.status(400).send("Product description is required");
  if (!quantity) return res.status(400).send("Product quantity is required");

  // Provjera i konverzija za specifications
  let specificationsMap = new Map();
  if (
    specifications &&
    typeof specifications === "object" &&
    !Array.isArray(specifications)
  ) {
    for (const [key, value] of Object.entries(specifications)) {
      specificationsMap.set(key, value);
    }
  } else {
    return res.status(400).send("Invalid specifications format");
  }

  try {
    const user = await User.findOne({ _id: owner });
    if (!user)
      return res.status(400).send("We couldn't find specified user, try again");

    const product = await Product.create({
      owner,
      price,
      image,
      name,
      specifications: specificationsMap,
      description,
      quantity,
    });

    if (!product) return res.status(400).send("Couldn't create new product");

    return res.status(200).send("Product added successfully");
  } catch (e) {
    return res.status(400).send(e?.message || "Something went wrong");
  }
});

/**
 * @swagger
 * /products/edit/{id}:
 *   patch:
 *     summary: Edit an existing product
 *     description: Updates an existing product by ID.
 *     tags: [ManipulateProducts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 description: Product price
 *               image:
 *                 type: string
 *                 description: Product image URL
 *               name:
 *                 type: string
 *                 description: Product name
 *               specifications:
 *                 type: object
 *                 description: Product specifications
 *               description:
 *                 type: string
 *                 description: Product description
 *               quantity:
 *                 type: number
 *                 description: Product quantity
 *               status:
 *                 type: string
 *                 description: Product status
 *               views:
 *                 type: number
 *                 description: Number of views
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Error updating product
 */
router.patch("/edit/:id", roleMiddleware("USER"), async (req, res) => {
  const {
    price,
    image,
    name,
    specifications,
    description,
    quantity,
    status,
    views,
  } = req.body || {};

  const productId = req.params.id;

  if (!productId)
    return res
      .status(400)
      .send("You didn't specify which product you are updating");

  if (
    !price &&
    !image &&
    !name &&
    !specifications &&
    !description &&
    !quantity &&
    !status &&
    !views
  )
    return res.status(400).send("All fields are empty, fill some field");

  try {
    const newProduct = await Product.findByIdAndUpdate(
      { _id: productId },
      {
        price,
        image,
        name,
        specifications,
        description,
        quantity,
        status,
        views,
      },
      { new: true }
    );

    if (!newProduct)
      return res.status(400).send("Couldn't update this product");

    res.send(`Product ${name} updated successfully`);
  } catch (e) {
    return res.status(400).status(e?.message || "Something went wrong");
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     description: Deletes a product by its ID.
 *     tags: [ManipulateProducts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Error deleting product
 */
router.delete("/:id", roleMiddleware("USER"), async (req, res) => {
  const productId = req.params.id;

  if (!productId)
    return res
      .status(400)
      .send("You didn't provide which product you want to delete");

  try {
    await Product.findByIdAndDelete(productId);

    return res.status(200).send("Product deleted successfully");
  } catch (e) {
    return res.status(400).status(e?.message || "Something went wrong");
  }
});

module.exports = router;
