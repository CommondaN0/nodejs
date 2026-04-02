import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import requireJson from "../middleware/requireJson.js";
import authenticate from "../middleware/authenticate.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.post("/register", requireJson, asyncHandler(authController.register));
router.post("/login", requireJson, asyncHandler(authController.login));
router.post("/logout", asyncHandler(authController.logout));
router.get("/me", authenticate, asyncHandler(authController.me));

export default router;