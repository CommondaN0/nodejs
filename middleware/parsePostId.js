import ApiError from "../utils/ApiError.js";

export default function parsePostId(req, res, next) {
  const postId = Number(req.params.postId);

  if (!Number.isInteger(postId) || postId < 1) {
    return next(new ApiError(400, "Invalid post id"));
  }

  req.postId = postId;
  next();
}
