import express from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";
import asyncHandler from "../middleware/asyncHandler.js";
import requireJson from "../middleware/requireJson.js";
import ApiError from "../utils/ApiError.js";

const router = express.Router({ mergeParams: true });

function parseUserId(req, res, next) {
  const userId = Number(req.params.userId);

  if (!Number.isInteger(userId) || userId < 1) {
    return next(new ApiError(400, "Invalid user id"));
  }

  req.userId = userId;
  next();
}

function parsePostId(req, res, next) {
  const postId = Number(req.params.postId);

  if (!Number.isInteger(postId) || postId < 1) {
    return next(new ApiError(400, "Invalid post id"));
  }

  req.postId = postId;
  next();
}

router.get(
  "/",
  parseUserId,
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const posts = await user.getPosts();
    res.status(200).json({ posts });
  })
);

router.post(
  "/",
  requireJson,
  parseUserId,
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const post = await user.createPost({
      title: req.body.title,
      content: req.body.content,
    });

    res.status(201).json({ created: post });
  })
);

router.get(
  "/:postId",
  parseUserId,
  parsePostId,
  asyncHandler(async (req, res) => {
    const post = await Post.findOne({
      where: {
        id: req.postId,
        userId: req.userId,
      },
    });

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    res.status(200).json({ post });
  })
);

export default router;