import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import requireJson from "../middleware/requireJson.js";
import parseUserId from "../middleware/parseUserId.js";
import * as userPostsController from "../controllers/userPostsController.js";

const router = express.Router({ mergeParams: true });

router.get("/", parseUserId, asyncHandler(userPostsController.getAllByUser));
router.post(
  "/",
  requireJson,
  parseUserId,
  asyncHandler(userPostsController.createForUser)
);

export default router;