import ApiError from "../utils/ApiError.js";

export default function parseTagId(req, res, next) {
  const tagId = Number(req.params.tagId);

  if (!Number.isInteger(tagId) || tagId < 1) {
    return next(new ApiError(400, "Invalid tag id"));
  }

  req.tagId = tagId;
  next();
}