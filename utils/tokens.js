import jwt from "jsonwebtoken";
import env from "../config/env.js";
import RefreshToken from "../models/RefreshToken.js";

export function signAccessToken(userId) {
  return jwt.sign({ userId }, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn,
  });
}

export function signRefreshToken(userId) {
  return jwt.sign({ userId }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  });
}

export async function saveRefreshToken(userId, token) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return RefreshToken.create({ token, userId, expiresAt });
}

export const ACCESS_COOKIE = {
  httpOnly: true,
  sameSite: "strict",
  maxAge: 15 * 60 * 1000, // 15 минут
};

export const REFRESH_COOKIE = {
  httpOnly: true,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
};