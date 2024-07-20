const express = require("express");
const User = require("../../models/UserModel");
const { roleMiddleware } = require("../../middlewares/authentication");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ADMIN routes
 *   description: Operations available only for ADMIN users
 */

/**
 * @swagger
 * /admin/setAsAdmin:
 *   patch:
 *     summary: Set user as administrator
 *     description: Sets a user's role as ADMIN.
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
 *               userId:
 *                 type: string
 *                 description: ID of the user to set as admin
 *                 example: 60e2ec097d93ae4a9c3425a1
 *     responses:
 *       200:
 *         description: User successfully set as administrator
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User john_doe has been set as administrator
 *       400:
 *         description: Error setting user as administrator
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Couldn't set this user as administrator
 */

router.patch("/setAsAdmin/:id", roleMiddleware("ADMIN"), async (req, res) => {
  const userId = req.params.id;
  if (!userId)
    return res
      .status(400)
      .send("You didn't provide which user you are trying to set as admin");

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { role: `${role === "USER" ? "ADMIN" : "USER"}` },
      { new: true }
    );
    if (!user)
      return res.status(400).send("Couldn't set this user as administrator");

    return res
      .status(200)
      .send(`User ${user.username} has been set as administrator`);
  } catch (e) {
    return res
      .status(400)
      .send("Something went wrong, couldn't set this user as admin");
  }
});

module.exports = router;
