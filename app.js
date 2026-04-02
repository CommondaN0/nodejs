import express from "express";
import router from "./routes/index.js";
import ApiError from "./utils/ApiError.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

app.use((req, res, next) => {
  next(new ApiError(404, "Route not found"));
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Invalid JSON in request body",
    });
  }

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      message: "Validation error",
      details: err.errors?.map((e) => ({
        message: e.message,
        path: e.path,
        value: e.value,
      })),
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      message: "Unique constraint error",
      details: err.errors?.map((e) => ({
        message: e.message,
        path: e.path,
        value: e.value,
      })),
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
      details: err.details ?? null,
    });
  }

  console.error(err);

  return res.status(500).json({
    message: "Internal server error",
  });
});

export default app;