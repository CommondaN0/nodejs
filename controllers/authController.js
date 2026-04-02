import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";
import {
  signAccessToken,
  signRefreshToken,
  saveRefreshToken,
  ACCESS_COOKIE,
  REFRESH_COOKIE,
} from "../utils/tokens.js";

export async function register(req, res) {
  const { name, password } = req.body;

  const existing = await User.findOne({ where: { name } });
  if (existing) throw new ApiError(409, "User already exists");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, passwordHash });

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);
  await saveRefreshToken(user.id, refreshToken);

  res.cookie("accessToken", accessToken, ACCESS_COOKIE);
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE);
  res.status(201).json({ user: { id: user.id, name: user.name } });
}

export async function login(req, res) {
  const { name, password } = req.body;

  const user = await User.findOne({ where: { name } });
  if (!user) throw new ApiError(401, "Invalid credentials");

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new ApiError(401, "Invalid credentials");

  // Удаляем старые refresh токены пользователя
  await RefreshToken.destroy({ where: { userId: user.id } });

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);
  await saveRefreshToken(user.id, refreshToken);

  res.cookie("accessToken", accessToken, ACCESS_COOKIE);
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE);
  res.status(200).json({ user: { id: user.id, name: user.name } });
}

export async function refresh(req, res) {
  const token = req.cookies.refreshToken;
  if (!token) throw new ApiError(401, "Refresh token missing");

  // Проверяем подпись
  let payload;
  try {
    payload = jwt.verify(token, env.jwtRefreshSecret);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  // Проверяем наличие в БД
  const stored = await RefreshToken.findOne({ where: { token } });
  if (!stored || stored.expiresAt < new Date()) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    throw new ApiError(401, "Refresh token revoked or expired");
  }

  // Token rotation — удаляем старый, создаём новый
  await stored.destroy();

  const newAccessToken = signAccessToken(payload.userId);
  const newRefreshToken = signRefreshToken(payload.userId);
  await saveRefreshToken(payload.userId, newRefreshToken);

  res.cookie("accessToken", newAccessToken, ACCESS_COOKIE);
  res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE);
  res.status(200).json({ message: "Tokens refreshed" });
}

export async function logout(req, res) {
  const token = req.cookies.refreshToken;

  if (token) {
    await RefreshToken.destroy({ where: { token } });
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out" });
}

export async function me(req, res) {
  res.status(200).json({ user: req.user });
}