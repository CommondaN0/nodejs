import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Tag from "../models/Tag.js";
import asyncHandler from "../middleware/asyncHandler.js";
import requireJson from "../middleware/requireJson.js";
import ApiError from "../utils/ApiError.js";

const router = express.Router();

function parsePostId(req, res, next) {
  const postId = Number(req.params.postId);

  if (!Number.isInteger(postId) || postId < 1) {
    return next(new ApiError(400, "Invalid post id"));
  }

  req.postId = postId;
  next();
}

function parseTagId(req, res, next) {
  const tagId = Number(req.params.tagId);

  if (!Number.isInteger(tagId) || tagId < 1) {
    return next(new ApiError(400, "Invalid tag id"));
  }

  req.tagId = tagId;
  next();
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    res.status(200).json({ posts });
  })
);

router.get(
  "/:postId",
  parsePostId,
  asyncHandler(async (req, res) => {
    const post = await Post.findByPk(req.postId, {
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    res.status(200).json({ post });
  })
);

/* Пока не работает
router.post(
  "/:postId/tags/:tagId",
  parsePostId,
  parseTagId,
  asyncHandler(async (req, res) => {
    const post = await Post.findByPk(req.postId);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    await post.addTag(req.tagId);

    const updatedPost = await Post.findByPk(req.postId, {
      include: [
        { model: User, as: "user" },
        { model: Tag, as: "tags" },
      ],
    });

    res.status(200).json({ post: updatedPost });
  })
);
*/

router.patch(
  "/:postId",
  requireJson,
  parsePostId,
  asyncHandler(async (req, res) => {
    const post = await Post.findByPk(req.postId);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    post.title = req.body.title ?? post.title;
    post.content = req.body.content ?? post.content;

    await post.save();

    res.status(200).json({ updated: post });
  })
);


router.delete(
  "/:postId",
  parsePostId,
  asyncHandler(async (req, res) => {
    const post = await Post.findByPk(req.postId);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    await post.destroy();
    res.status(204).end();
  })
);

export default router;