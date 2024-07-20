const express = require("express");
const User = require("../../models/UserModel");
const Article = require("../../models/ProductModel");
const RepUser = require("../../models/ReportedUser");
const RepArticle = require("../../models/ReportedArticle");
const { roleMiddleware } = require("../../middlewares/authentication");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: API for reporting users and articles
 */

/**
 * @swagger
 * /reports/user:
 *   post:
 *     summary: Report a user
 *     description: Report a user by providing their ID and a reason.
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportedBy:
 *                 type: string
 *                 description: ID of the user reporting
 *               reportedUser:
 *                 type: string
 *                 description: ID of the user being reported
 *               reason:
 *                 type: string
 *                 description: Reason for reporting the user
 *               additionalMessage:
 *                 type: string
 *                 description: Additional message or details
 *     responses:
 *       200:
 *         description: User reported successfully
 *       400:
 *         description: Error reporting user
 */
router.post("/user", roleMiddleware("USER"), async ({ body }, res) => {
  const { reportedBy, reportedUser, reason, additionalMessage } = body || {};

  if (!reportedBy)
    return res
      .status(400)
      .send("Make sure you are logged in and try again later");
  if (!reportedUser)
    return res
      .status(400)
      .send("You didn't provide which user you are reporting");
  if (!reason) return res.status(400).send("Reason is required");

  try {
    const reportedByUser = await User.findById(reportedBy);
    if (!reportedByUser)
      return res
        .status(400)
        .send("Couldn't find you, make sure you are logged in");

    const reportedUserUser = await User.findById(reportedUser);
    if (!reportedUserUser)
      return res
        .status(400)
        .send("Couldn't find the user you are trying to report");

    await RepUser.create({
      reportedBy,
      reportedUser,
      reason,
      additionalMessage,
    });

    return res.status(200).send("User reported successfully");
  } catch (e) {
    return res.status(400).send("Something went wrong, couldn't report user");
  }
});

/**
 * @swagger
 * /reports/article:
 *   post:
 *     summary: Report an article
 *     description: Report an article by providing its ID and a reason.
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportedBy:
 *                 type: string
 *                 description: ID of the user reporting
 *               reportedArticle:
 *                 type: string
 *                 description: ID of the article being reported
 *               reason:
 *                 type: string
 *                 description: Reason for reporting the article
 *               additionalMessage:
 *                 type: string
 *                 description: Additional message or details
 *     responses:
 *       200:
 *         description: Article reported successfully
 *       400:
 *         description: Error reporting article
 */
router.post("/article", roleMiddleware("USER"), async ({ body }, res) => {
  const { reportedBy, reportedArticle, reason, additionalMessage } = body || {};

  if (!reportedBy)
    return res
      .status(400)
      .send("Make sure you are logged in and try again later");
  if (!reportedArticle)
    return res
      .status(400)
      .send("You didn't provide which article you are reporting");
  if (!reason) return res.status(400).send("Reason is required");

  try {
    const reportedByUser = await User.findById(reportedBy);
    if (!reportedByUser)
      return res
        .status(400)
        .send("Couldn't find you, make sure you are logged in");

    const repArticle = await Article.findById(reportedArticle);
    if (!repArticle)
      return res
        .status(400)
        .send("Couldn't find the article you are trying to report");

    await RepArticle.create({
      reportedBy,
      reportedArticle,
      reason,
      additionalMessage,
    });

    return res.status(200).send("Article reported successfully");
  } catch (e) {
    return res
      .status(400)
      .send("Something went wrong, couldn't report article");
  }
});

module.exports = router;
