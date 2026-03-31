import express from "express";
import requireJson from "../middleware/requireJson.js";

const users = [{name: "Bob", id: 0}];
let fakeAi = 1;

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ users: users });
});

router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        user,
        query: req.query
    });
});

router.post("/", requireJson, (req, res) => {
    if(!req.body.name) {
        return res.status(400).json({
            message: "Field name is require"
        })
    }
    const newUser = {
        name: req.body.name,
        id: fakeAi++
    };

    users.push(newUser);

    res.status(201).json({
        created: newUser
    });
});

router.patch("/:id", requireJson, (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (!req.body.name) {
        return res.status(400).json({ message: "Field name is required" });
    }

    user.name = req.body.name;

    return res.status(200).json({ updated: user });
});

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    users.splice(index, 1);
    
    return res.status(204).end();
});

export default router;