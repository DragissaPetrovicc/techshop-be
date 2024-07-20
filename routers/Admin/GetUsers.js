// routes/admin.js
const express = require("express");
const User = require("../../models/UserModel");
const { roleMiddleware } = require("../../middlewares/authentication");

const router = express.Router();

/**
 * @swagger
 * /allUsers:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [ADMIN routes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Couldn't fetch all users
 */
router.get("/allUsers", roleMiddleware("ADMIN"), async (req, res) => {
  try {
    const users = await User.find();
    if (!users) return res.status(400).send("There is no users existing");

    return res.status(200).send(users);
  } catch (e) {
    return res.status(400).send("Couldn't fetch all users");
  }
});

module.exports = router;
