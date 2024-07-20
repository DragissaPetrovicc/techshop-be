const express = require("express");
const ArticleReps = require("../../models/ReportedArticle");
const UserReps = require("../../models/ReportedUser");
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
 * /admin/reports/user:
 *   get:
 *     summary: Get all user reports
 *     description: Retrieves all reports of users.
 *     tags: [ADMIN routes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserReport'
 *       400:
 *         description: Error fetching user reports
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Couldn't fetch user reports
 */

/**
 * @swagger
 * /admin/reports/article:
 *   get:
 *     summary: Get all article reports
 *     description: Retrieves all reports of articles.
 *     tags: [ADMIN routes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of article reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ArticleReport'
 *       400:
 *         description: Error fetching article reports
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Couldn't fetch article reports
 */

router.get("/reports/user", roleMiddleware("ADMIN"), async (req, res) => {
  try {
    const reps = await UserReps.find()
      .populate("reportedBy")
      .populate("reportedUser");
    if (reps.length === 0)
      return res
        .status(400)
        .send("There are no user reports available at the moment");

    return res.status(200).send(reps);
  } catch (e) {
    return res.status(400).send("Couldn't fetch user reports");
  }
});

router.get("/reports/article", roleMiddleware("ADMIN"), async (req, res) => {
  try {
    const reps = await ArticleReps.find()
      .populate("reportedBy")
      .populate("reportedArticle");
    if (reps.length === 0)
      return res
        .status(400)
        .send("There are no article reports available at the moment");

    return res.status(200).send(reps);
  } catch (e) {
    return res.status(400).send("Couldn't fetch article reports");
  }
});

router.get("/report/article/:id", roleMiddleware("ADMIN"), async (req, res) => {
  const id = req.params.id;
  if (!id)
    return res
      .status(400)
      .send("You didn't specified what report you are trying to fetch");

  try {
    const rep = await ArticleReps.findById(id)
      .populate("reportedBy")
      .populate("reportedArticle");
    if (!rep) return res.status(400).send("Specified report doesn't exist");

    return res.status(200).send(rep);
  } catch (e) {
    return res.status(400).send(e?.message || "Something went wrong");
  }
});

router.get("/report/user/:id", roleMiddleware("ADMIN"), async (req, res) => {
  const id = req.params.id;
  if (!id)
    return res
      .status(400)
      .send("You didn't specified what report you are trying to fetch");

  try {
    const rep = await UserReps.findById(id)
      .populate("reportedBy")
      .populate("reportedUser");
    if (!rep) return res.status(400).send("Specified report doesn't exist");

    return res.status(200).send(rep);
  } catch (e) {
    return res.status(400).send(e?.message || "Something went wrong");
  }
});

module.exports = router;
