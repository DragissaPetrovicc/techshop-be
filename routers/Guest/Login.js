/**
 * @swagger
 * /login/user:
 *   post:
 *     summary: Login user
 *     description: Login existing user with username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request or user not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *     tags:
 *       - Login
 */
const express = require("express");
const User = require("../../models/UserModel");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const bcrypt = require("bcrypt");

const router = express.Router();
config();

router.post("/user", async ({ body }, res) => {
  try {
    const { username, password } = body || {};
    if (!username) return res.status(400).send("Username is required");
    if (!password) return res.status(400).send("Password is required");

    const user = await User.findOne({ username: username });
    if (!user) return res.status(400).send("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send("Incorrect password");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    user.password = undefined;

    return res.send({ token, data: user });
  } catch (e) {
    return res.status(400).send("Couldn't login user");
  }
});

module.exports = router;
