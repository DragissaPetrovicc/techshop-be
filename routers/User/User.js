const express = require("express");
const User = require("../../models/UserModel");
const { config } = require("dotenv");
const bcrypt = require("bcrypt");
const { roleMiddleware } = require("../../middlewares/authentication");

const router = express.Router();
config();

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/;

/**
 * @swagger
 * tags:
 *   name: Manipulate with users
 *   description: CRUD operations for managing users
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve a user's details by their ID.
 *     tags: [Manipulate with users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       400:
 *         description: Error retrieving user details
 */
router.get("/:id", roleMiddleware("USER"), async (req, res) => {
  const userId = req.params.id;
  if (!userId) return res.status(400).send("User id is not provided");

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).send("Specified user doesn't exist");

    return res.status(200).send(user);
  } catch (e) {
    return res.status(400).send("Couldn't fetch user");
  }
});

/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Update a user by ID
 *     description: Update a user's details by their ID.
 *     tags: [Manipulate with users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Error updating user
 */
router.patch("/:id", roleMiddleware("USER"), async (req, res) => {
  const userId = req.params.id;

  if (!userId) return res.status(400).send("User id is not provided");

  const { email, username, password, image } = req.body || {};

  if (!email && !username && !password && !image)
    return res.status(400).send("Field is empty, couldn't update user");

  try {
    const user = await User.findById(userId);
    const users = await User.find();

    users.map((u) => {
      if (u.email === email)
        return res.status(400).send("Email is already used");
      if (u.username === username)
        return res.status(400).send("Username is already used");
    });

    const userUpdate = {};

    if (username) {
      if (username.trim().length < 6)
        return res
          .status(400)
          .send("Username must be at least 6 characters long");
    }

    if (email) {
      if (!emailRegex.test(email))
        return res.status(400).send("Email is not valid (user123@gmail.com)");
    }
    if (password) {
      if (password.trim().length < 6)
        return res
          .status(400)
          .send("Password must be at least 6 characters long");

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        req.body.password = hash;
        userUpdate.password = hash;
      }
    }

    userUpdate.username = username;
    userUpdate.email = email;
    userUpdate.image = image;

    const updatedUser = await User.findByIdAndUpdate(userId, userUpdate, {
      new: true,
    });

    if (!updatedUser) return res.status(400).send("Couldn't update user");

    return res.status(200).send("User updated successfully");
  } catch (e) {
    return res.status(400).send(e?.message || "Something went wrong");
  }
});

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Delete a user's account by their ID.
 *     tags: [Manipulate with users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Error deleting user
 */
router.delete("/:id", roleMiddleware("USER"), async (req, res) => {
  const userId = req.params.id;
  if (!userId)
    return res
      .status(400)
      .send("You didn't provide which user you are trying to delete");

  try {
    await User.findByIdAndDelete(userId);
    return res.status(200).send("User deleted successfully");
  } catch (e) {
    return res.status(400).send(e?.message || "Something went wrong");
  }
});

module.exports = router;
