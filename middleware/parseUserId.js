import ApiError from "../utils/ApiError.js";

export default function parseUserId(req, res, next) {
  const userId = Number(req.params.userId);

  if (!Number.isInteger(userId) || userId < 1) {
    return next(new ApiError(400, "Invalid user id"));
  }

  req.userId = userId;
  next();
}