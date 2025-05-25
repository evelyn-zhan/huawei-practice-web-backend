import express from "express"
import User from "../models/User.js"

const router = express.Router()

// GET all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: "Failed to get users", error: error.message })
    }
})

router.post("/", async (req, res) => {
    try {
        const newUser = new User(req.body)
        const savedUser = await newUser.save()
        res.status(201).json({
            message: "User created successfully",
            user: {
                userId: savedUser.userId,
                username: savedUser.username,
                class: savedUser.class
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Failed to create user", error: error.message })
    }
})

export default router