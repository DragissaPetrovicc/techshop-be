const express = require("express");
const Rating = require("../../models/StarRating");
const User = require("../../models/UserModel");
const { roleMiddleware } = require("../../middlewares/authentication");

const router = express.Router();

/**
 * @swagger
 * /rate/app:
 *   post:
 *     summary: Rate the application
 *     description: Allows a user to rate the application by providing the number of stars.
 *     tags:
 *       - Rating
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ratedBy:
 *                 type: string
 *                 description: User ID
 *               stars:
 *                 type: number
 *                 description: Number of stars
 *     responses:
 *       200:
 *         description: Thank you for sharing your opinion
 *       400:
 *         description: Couldn't rate app, try again later
 */
router.post("/app", roleMiddleware("USER"), async ({ body }, res) => {
  const { ratedBy, stars } = body || {};

  if (!ratedBy) return res.status(400).send("Make sure you are logged in");
  if (!stars) return res.status(400).send("Number of stars is required");

  try {
    const user = await User.findByIdAndUpdate(
      ratedBy,
      { rated: true },
      { new: true }
    );
    if (!user) return res.status(400).send("User doesn't exist");

    await Rating.create({ ratedBy, stars });

    return res.status(200).send("Thank you for rating our app");
  } catch (e) {
    return res
      .status(400)
      .send(e?.message || "Couldn't rate app, try again later");
  }
});

module.exports = router;
