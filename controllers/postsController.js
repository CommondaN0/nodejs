import Post from "../models/Post.js";
import User from "../models/User.js";
import Tag from "../models/Tag.js";
import ApiError from "../utils/ApiError.js";

export async function getAll(req, res) {
  const posts = await Post.findAll({
    include: [{ model: User, as: "user" }],
  });

  res.status(200).json({ posts });
}

export async function getById(req, res) {
  const post = await Post.findByPk(req.postId, {
    include: [
      { model: User, as: "user" },
      { model: Tag, as: "tags" },
    ],
  });

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  res.status(200).json({ post });
}

export async function addTag(req, res) {
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
}

export async function update(req, res) {
  const post = await Post.findByPk(req.postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  post.title = req.body.title ?? post.title;
  post.content = req.body.content ?? post.content;

  await post.save();

  res.status(200).json({ updated: post });
}

export async function remove(req, res) {
  const post = await Post.findByPk(req.postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  await post.destroy();
  res.status(204).end();
}