import User from "../models/User.js";
import Post from "../models/Post.js";
import ApiError from "../utils/ApiError.js";

export async function getAllByUser(req, res) {
  const user = await User.findByPk(req.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const posts = await Post.findAll({
    where: { userId: req.userId },
  });

  res.status(200).json({ posts });
}

export async function createForUser(req, res) {
  const user = await User.findByPk(req.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const post = await Post.create({
    title: req.body.title,
    content: req.body.content,
    userId: req.userId,
  });

  res.status(201).json({ post });
}