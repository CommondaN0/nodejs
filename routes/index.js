import apiRouter from "./api.js"
import userRouter from "./users.js"
import express from "express";

const router = express.Router();

router.use(apiRouter);
router.use("/users", userRouter);

export default router;