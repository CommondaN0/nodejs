import apiRouter from "./api.js"
import userRouter from "./users.js"
import postsRouter from "./posts.js"
import express from "express";

const router = express.Router();

router.use(apiRouter);
router.use("/users", userRouter);
router.use("/posts", postsRouter)

export default router;