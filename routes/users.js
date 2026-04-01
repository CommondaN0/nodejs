import express from "express";
import requireJson from "../middleware/requireJson.js";
import { User } from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const users = await User.findAll();
    res.status(200).json({ users });
});

router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const user = User.findByPk(id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        user,
        query: req.query
    });
});

router.post("/", requireJson, async (req, res) => {
    if(!req.body.name) {
        return res.status(400).json({
            message: "Field name is required"
        })
    }
    const newUser = await User.create({
        name: req.body.name,
    });

    res.status(201).json({
        created: newUser
    });
});

router.patch("/:id", requireJson, async (req, res) => {
    const id = Number(req.params.id);
    const user = User.findByPk(id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (!req.body.name) {
        return res.status(400).json({ message: "Field name is required" });
    }

    user.name = req.body.name;
    await user.save();

    return res.status(200).json({ updated: user });
});

router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const user = User.findByPk(id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    
    return res.status(204).end();
});

export default router;