const express = require("express");
const Ratings = require("../../models/StarRating");
const User = require("../../models/UserModel");
const { roleMiddleware } = require("../../middlewares/authentication");

const router = express.Router();

/**
 * @swagger
 * /ratedBy/{id}:
 *   patch:
 *     summary: Update user rating status
 *     description: Update the rating status of a user after they have rated the application.
 *     tags:
 *       - Rating
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User rating status updated successfully
 *       400:
 *         description: Error updating user rating status
 */
router.patch("/:id", roleMiddleware("USER"), async (req, res) => {
  const userId = req.params.id;
  if (!userId)
    return res
      .status(400)
      .send("Make sure you are logged in,we couldn't find you");

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).send("Provided user doesn't exist");

    const rating = await Ratings.findOne({ ratedBy: userId });
    if (!rating)
      return res.status(400).send("You still didn't rate applicatiom");

    await User.findByIdAndUpdate(userId, { rated: true }, { new: true });

    return res
      .status(200)
      .send("You are already rated our application,thank you");
  } catch (e) {
    return res
      .status(400)
      .send("Something went wrong se we couldn't fetch your rating");
  }
});

module.exports = router;
