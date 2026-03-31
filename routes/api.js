import express from "express";
import requireJson from "../middleware/requireJson.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

router.get("/headers", (req, res) => {
  res.status(200).json({ headers: req.headers });
});

router.get("/search", (req, res) => {
    res.status(200).json({query: req.query});
});

router.get("/request-info", (req, res) => {
  res.status(200).json({
    method: req.method,
    path: req.path,
    query: req.query
  });
});

router.post("/echo", requireJson, (req, res) => {
  res.status(200).json({ received: req.body });
});

export default router;