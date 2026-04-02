import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";

export default async function authenticate(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) return next(new ApiError(401, "Not authenticated"));

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret);
    const user = await User.findByPk(payload.userId);

    if (!user) return next(new ApiError(401, "User not found"));

    req.user = { id: user.id, name: user.name };
    next();
  } catch {
    return next(new ApiError(401, "Invalid or expired access token"));
  }
}