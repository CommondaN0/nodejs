import express from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";
import asyncHandler from "../middleware/asyncHandler.js";
import requireJson from "../middleware/requireJson.js";
import parseUserId from "../middleware/parseUserId.js";
import normalizeUserName from "../middleware/normalizeUserName.js";
import postsRouter from "./userPosts.js";
import ApiError from "../utils/ApiError.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.status(200).json({ users });
  })
);

router.get(
  "/:id",
  parseUserId,
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.userId, {
      include: [
        {
          model: Post,
          as: "posts",
        },
      ],
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json({ user });
  })
);

router.post(
  "/",
  requireJson,
  normalizeUserName,
  asyncHandler(async (req, res) => {
    const user = await User.create({
      name: req.body.name,
    });

    res.status(201).json({ created: user });
  })
);

router.post(
  "/:id/posts",
  requireJson,
  parseUserId,
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      userId: user.id,
    });

    res.status(201).json({ created: post });
  })
);

router.patch(
  "/:id",
  requireJson,
  parseUserId,
  normalizeUserName,
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.name = req.body.name;
    await user.save();

    res.status(200).json({ updated: user });
  })
);

router.delete(
  "/:id",
  parseUserId,
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await user.destroy();
    res.status(204).end();
  })
);

router.use("/:userId/posts", postsRouter);

export default router;