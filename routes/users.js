import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import requireJson from "../middleware/requireJson.js";
import normalizeUserName from "../middleware/normalizeUserName.js";
import parseUserId from "../middleware/parseUserId.js";
import * as usersController from "../controllers/usersController.js";
import userPostsRouter from "./userPosts.js";

const router = express.Router();

router.get("/", asyncHandler(usersController.getAll));
router.get("/:userId", parseUserId, asyncHandler(usersController.getById));
router.post("/", requireJson, normalizeUserName, asyncHandler(usersController.create));
router.patch(
  "/:userId",
  requireJson,
  parseUserId,
  normalizeUserName,
  asyncHandler(usersController.update)
);
router.delete("/:userId", parseUserId, asyncHandler(usersController.remove));

router.use("/:userId/posts", userPostsRouter);

export default router;