const express = require("express");
const User = require("../../models/UserModel");
const { config } = require("dotenv");
const bcrypt = require("bcrypt");
const { roleMiddleware } = require("../../middlewares/authentication");

config();

const router = express.Router();

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/;
const phoneNumberRegex = /^\+[0-9]+$/;

/**
 * @swagger
 * tags:
 *   name: ADMIN routes
 *   description: Operations available only for ADMIN users
 */

/**
 * @swagger
 * /admin/addUser:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user account with ADMIN privileges.
 *     tags: [ADMIN routes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *               role:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   state:
 *                     type: string
 *                   city:
 *                     type: string
 *             example:
 *               firstName: John
 *               lastName: Doe
 *               username: johndoe
 *               email: johndoe@example.com
 *               phoneNumber: "+1234567890"
 *               password: password123
 *               image: "http://example.com/avatar.jpg"
 *               role: ADMIN
 *               location:
 *                 state: California
 *                 city: Los Angeles
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: You created new user johndoe successfully
 *       400:
 *         description: Error creating user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Username already exists
 */
router.post("/addUser", roleMiddleware("ADMIN"), async ({ body }, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    phoneNumber,
    password,
    role,
    location: { state, city },
  } = body || {};

  const users = await User.find();

  if (!firstName) return res.status(400).send("Firstname is required");
  if (!lastName) return res.status(400).send("Lastname is required");
  if (!username) return res.status(400).send("Username is required");
  if (!email) return res.status(400).send("Email is required");
  if (!phoneNumber) return res.status(400).send("Phone number is required");
  if (!state || !city) return res.status(400).send("Location is required");

  if (username.trim().length < 6)
    return res.status(400).send("Username must be at least 6 characters long");
  if (password.trim().length < 6)
    return res.status(400).send("Password must be at least 6 characters long");

  if (!emailRegex.test(email))
    return res.status(400).send("Email is not valid (user123@gmail.com)");
  if (!phoneNumberRegex.test(phoneNumber))
    return res.status(400).send("Phone number is not valid (+387 12123123)");

  users.map((u) => {
    if (u.username === username)
      return res.status(400).send("Username already exists");
    if (u.email === email) return res.status(400).send("Email already exists");
    if (u.phoneNumber === phoneNumber)
      return res.status(400).send("Phone number is already used");
  });

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  body.password = hash;

  try {
    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      password: hash,
      location: { state, city },
      role,
      verification: true,
    });

    newUser.password = undefined;

    return res
      .status(200)
      .send(`You created new user ${newUser.username} successfully`);
  } catch (e) {
    res
      .status(400)
      .send("Something went wrong so you couldn't create new user");
  }
});

module.exports = router;
