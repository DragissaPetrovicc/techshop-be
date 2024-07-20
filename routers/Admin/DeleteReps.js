const express = require("express");
const UserReps = require("../../models/ReportedUser");
const ArticleReps = require("../../models/ReportedArticle");
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
 * /admin/delete/userRep:
 *   delete:
 *     summary: Delete a reported user
 *     description: Deletes a reported user based on the provided report ID.
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
 *               repId:
 *                 type: string
 *             example:
 *               repId: "611b2d19cfe556001e7b2a3f"
 *     responses:
 *       200:
 *         description: Report deleted successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Report deleted successfully
 *       400:
 *         description: Error deleting report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Couldn't find and delete specified report
 */
router.delete(
  "/delete/userRep/:id",
  roleMiddleware("ADMIN"),
  async (req, res) => {
    const repId = req.params.id;
    if (!repId)
      return res
        .status(400)
        .send("You didn't provide which report you are trying to delete");

    try {
      const repUser = await UserReps.findByIdAndDelete(repId);
      if (!repUser)
        return res
          .status(400)
          .send("Couldn't find and delete specified report");

      return res.status(200).send("Report deleted successfully");
    } catch (e) {
      return res
        .status(400)
        .send("Something went wrong,couldn't delete report");
    }
  }
);

/**
 * @swagger
 * /admin/delete/articleRep:
 *   delete:
 *     summary: Delete a reported article
 *     description: Deletes a reported article based on the provided report ID.
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
 *               repId:
 *                 type: string
 *             example:
 *               repId: "611b2d19cfe556001e7b2a3f"
 *     responses:
 *       200:
 *         description: Report deleted successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Report deleted successfully
 *       400:
 *         description: Error deleting report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Couldn't find and delete specified report
 */
router.delete(
  "/delete/articleRep/:id",
  roleMiddleware("ADMIN"),
  async (req, res) => {
    const repId = req.params.id;
    if (!repId)
      return res
        .status(400)
        .send("You didn't provide which report you are trying to delete");

    try {
      const repArticle = await ArticleReps.findByIdAndDelete(repId);
      if (!repArticle)
        return res
          .status(400)
          .send("Couldn't find and delete specified report");

      return res.status(200).send("Report deleted successfully");
    } catch (e) {
      return res
        .status(400)
        .send("Something went wrong,couldn't delete report");
    }
  }
);

module.exports = router;
