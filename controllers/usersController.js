import User from "../models/User.js";
import Post from "../models/Post.js";
import ApiError from "../utils/ApiError.js";

export async function getAll(req, res) {
  const users = await User.findAll();
  res.status(200).json({ users });
}

export async function getById(req, res) {
  const user = await User.findByPk(req.userId, {
    include: [{ model: Post, as: "posts" }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({ user });
}

export async function create(req, res) {
  const user = await User.create({
    name: req.body.name,
  });

  res.status(201).json({ user });
}

export async function update(req, res) {
  const user = await User.findByPk(req.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.name = req.body.name ?? user.name;

  await user.save();

  res.status(200).json({ updated: user });
}

export async function remove(req, res) {
  const user = await User.findByPk(req.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await user.destroy();
  res.status(204).end();
}