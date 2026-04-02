import express from "express";
import apiRouter from "./api.js";
import authRouter from "./auth.js";
import userRouter from "./users.js";
import postsRouter from "./posts.js";

const router = express.Router();

router.use(apiRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/posts", postsRouter);

export default router;