import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
};

export async function register(req, res) {
  const { name, password } = req.body;

  const existing = await User.findOne({ where: { name } });
  if (existing) {
    throw new ApiError(409, "User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, passwordHash });

  const token = jwt.sign({ userId: user.id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  res.cookie("token", token, COOKIE_OPTIONS);
  res.status(201).json({ user: { id: user.id, name: user.name } });
}

export async function login(req, res) {
  const { name, password } = req.body;

  const user = await User.findOne({ where: { name } });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.sign({ userId: user.id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  res.cookie("token", token, COOKIE_OPTIONS);
  res.status(200).json({ user: { id: user.id, name: user.name } });
}

export async function logout(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
}

export async function me(req, res) {
  res.status(200).json({ user: req.user });
}