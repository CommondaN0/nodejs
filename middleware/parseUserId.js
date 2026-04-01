import ApiError from "../utils/ApiError.js";

export default function parseUserId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return next(new ApiError(400, "Invalid user id"));
  }

  req.userId = id;
  next();
}