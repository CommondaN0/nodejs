export default function normalizeUserName(req, res, next) {
  if (typeof req.body.name === "string") {
    req.body.name = req.body.name.trim();
  }

  next();
}