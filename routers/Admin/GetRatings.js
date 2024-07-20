const express = require("express");
const Ratings = require("../../models/StarRating");
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
 * /admin/allRatings:
 *   get:
 *     summary: Get all ratings
 *     description: Retrieves all ratings along with user information.
 *     tags: [ADMIN routes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of ratings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   ratedBy:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                   stars:
 *                     type: number
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Error fetching ratings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Couldn't fetch ratings
 */
router.get("/allRatings", roleMiddleware("ADMIN"), async (req, res) => {
  try {
    const ratings = await Ratings.find().populate("ratedBy");
    if (!ratings)
      return res
        .status(400)
        .send("There are no ratings available at the moment");

    return res.status(200).send(ratings);
  } catch (e) {
    return res.status(400).send("Couldn't fetch ratings");
  }
});

module.exports = router;
