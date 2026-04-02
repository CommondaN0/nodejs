import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import requireJson from "../middleware/requireJson.js";
import parsePostId from "../middleware/parsePostId.js";
import parseTagId from "../middleware/parseTagId.js";
import * as postsController from "../controllers/postsController.js";

const router = express.Router();

router.get("/", asyncHandler(postsController.getAll));
router.get("/:postId", parsePostId, asyncHandler(postsController.getById));
router.post(
  "/:postId/tags/:tagId",
  parsePostId,
  parseTagId,
  asyncHandler(postsController.addTag)
);
router.patch(
  "/:postId",
  requireJson,
  parsePostId,
  asyncHandler(postsController.update)
);
router.delete(
  "/:postId",
  parsePostId,
  asyncHandler(postsController.remove)
);

export default router;