const express = require("express");
const Products = require("../../models/ProductModel");
const User = require("../../models/UserModel");

const router = express.Router();

let displayedProducts = 0;

/**
 * @swagger
 * /products/all:
 *   get:
 *     summary: Get all products
 *     description: Retrieve all products with pagination.
 *     tags:
 *       - Get Products
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: No products available or error fetching products
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get("/all", async (req, res) => {
  try {
    displayedProducts += 20;

    const products = await Products.find()
      .populate("owner")
      .limit(displayedProducts);

    if (!products || products.length === 0)
      return res
        .status(400)
        .send("There are no products available at the moment");

    return res.status(200).send(products);
  } catch (e) {
    return res.status(400).send(e?.message || "Couldn't fetch products");
  }
});

/**
 * @swagger
 * /products/sort/byName:
 *   get:
 *     summary: Sort products by name
 *     description: Retrieve products sorted alphabetically by name.
 *     tags:
 *       - Get Products
 *     responses:
 *       200:
 *         description: A list of products sorted by name
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: No products available or error fetching products sorted by name
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get("/sort/byName", async (req, res) => {
  try {
    const products = await Products.find().populate("owner").sort({ name: 1 });
    if (!products)
      return res
        .status(400)
        .send("There is no products available at the moment");

    return res.status(200).send(products);
  } catch (e) {
    return res.status(400).send("Couldn't fetch products sorted by name");
  }
});

/**
 * @swagger
 * /products/sort/byPrice:
 *   get:
 *     summary: Sort products by price
 *     description: Retrieve products sorted by price in descending order.
 *     tags:
 *       - Get Products
 *     responses:
 *       200:
 *         description: A list of products sorted by price
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: No products available or error fetching products sorted by price
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get("/sort/byPrice", async (req, res) => {
  try {
    const products = await Products.find()
      .populate("owner")
      .sort({ price: -1 });
    if (!products)
      return res
        .status(400)
        .send("There is no products available at the moment");

    return res.status(200).send(products);
  } catch (e) {
    return res.status(400).send("Couldn't fetch products sorted by price");
  }
});

/**
 * @swagger
 * /products/sort/byQuantity:
 *   get:
 *     summary: Sort products by quantity
 *     description: Retrieve products sorted by quantity in descending order.
 *     tags:
 *       - Get Products
 *     responses:
 *       200:
 *         description: A list of products sorted by quantity
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: No products available or error fetching products sorted by quantity
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get("/sort/byQuantity", async (req, res) => {
  try {
    const products = await Products.find()
      .populate("owner")
      .sort({ quantity: -1 });
    if (!products)
      return res
        .status(400)
        .send("There is no products available at the moment");

    return res.status(200).send(products);
  } catch (e) {
    return res.status(400).send("Couldn't fetch products sorted by quantity");
  }
});

/**
 * @swagger
 * /products/sort/byDate:
 *   get:
 *     summary: Sort products by date
 *     description: Retrieve products sorted by date of creation in descending order.
 *     tags:
 *       - Get Products
 *     responses:
 *       200:
 *         description: A list of products sorted by date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: No products available or error fetching products sorted by date
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get("/sort/byDate", async (req, res) => {
  try {
    const products = await Products.find()
      .populate("owner")
      .sort({ createdAt: -1 });
    if (!products || products.length === 0)
      return res
        .status(400)
        .send("There are no products available at the moment");

    return res.status(200).send(products);
  } catch (e) {
    return res.status(400).send("Couldn't fetch products sorted by date");
  }
});

/**
 * @swagger
 * /products/sort/byViews:
 *   get:
 *     summary: Sort products by views
 *     description: Retrieve products sorted by number of views in descending order.
 *     tags:
 *       - Get Products
 *     responses:
 *       200:
 *         description: A list of products sorted by views
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: No products available or error fetching products sorted by views
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get("/sort/byViews", async (req, res) => {
  try {
    const products = await Products.find()
      .populate("owner")
      .sort({ views: -1 });
    if (!products || products.length === 0)
      return res
        .status(400)
        .send("There are no products available at the moment");

    return res.status(200).send(products);
  } catch (e) {
    return res.status(400).send("Couldn't fetch products sorted by views");
  }
});

/**
 * @swagger
 * /products/filter/price:
 *   get:
 *     summary: Filter products by price
 *     description: Retrieve products filtered by price range.
 *     tags:
 *       - Get Products
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: to
 *         schema:
 *           type: number
 *         description: Maximum price
 *     responses:
 *       200:
 *         description: A list of products filtered by price
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: No products available or error fetching products filtered by price
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get("/filter/price", async (req, res) => {
  const { from, to } = req.query;

  if (!from && !to)
    return res
      .status(400)
      .send("Couldn't filter because price fields are both empty");

  try {
    let filter = {};
    if (from && to) {
      filter.price = { $gt: from, $lt: to };
    } else if (from) {
      filter.price = { $gt: from };
    } else if (to) {
      filter.price = { $lt: to };
    }

    const products = await Products.find(filter).populate("owner");
    if (!products || products.length === 0)
      return res
        .status(400)
        .send("There are no products available at the moment");

    return res.status(200).send(products);
  } catch (e) {
    return res
      .status(400)
      .send("Couldn't fetch products filtered by their prices");
  }
});

/**
 * @swagger
 * /products/filter/name:
 *   get:
 *     summary: Filter products by name
 *     description: Retrieve products filtered by name.
 *     tags:
 *       - Get Products
 *     parameters:
 *       - in: query
 *         name: searchQuery
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query for product name
 *     responses:
 *       200:
 *         description: A list of products filtered by name
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: No products available or error fetching products filtered by name
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get("/filter/byName", async (req, res) => {
  const { search } = req.query;

  try {
    if (search) {
      const filter = { name: { $regex: search, $options: "i" } }; // 'i' opcija je za case-insensitive pretragu
      const products = await Products.find(filter);
      if (!products || products.length === 0) {
        return res.status(404).send("No such products available");
      }

      return res.status(200).send(products);
    } else {
      const products = await Products.find();
      return res.status(200).send(products);
    }
  } catch (e) {
    return res
      .status(500)
      .send("Couldn't fetch products filtered by their name");
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a product by its ID.
 *     tags:
 *       - Get Products
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: A single product object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Product not found or error fetching product
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get("/:id", async (req, res) => {
  const productId = req.params.id;
  if (!productId) {
    return res
      .status(400)
      .send("You didn't provide which product you want to visit");
  }

  try {
    const prod = await Products.findById(productId);

    if (!prod) {
      return res.status(400).send("This product doesn't exist");
    }

    prod.views += 1;
    await prod.save();

    const updatedProd = await Products.findById(productId).populate("owner");

    return res.status(200).send(updatedProd);
  } catch (e) {
    return res
      .status(400)
      .send(e?.message || "Couldn't fetch specified product");
  }
});

/**
 * @swagger
 * /products/user/{id}:
 *   get:
 *     summary: Get products by user ID
 *     description: Retrieve products published by a specific user.
 *     tags:
 *       - Get Products
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: A list of products published by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: User not found or user has no products published
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  if (!userId)
    return res
      .status(400)
      .send("You didn't provide for what user you fetching products");

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).send("Provided user doesn't exist");
    const products = await Products.find({ owner: userId }).populate("owner");
    if (!products)
      return res
        .status(400)
        .send("This user doesn't have any product published");

    return res.send(products);
  } catch (e) {
    return res
      .status(400)
      .send(e?.message || "Couldn't fetch specified product");
  }
});

module.exports = router;
