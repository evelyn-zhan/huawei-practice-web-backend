import express from "express"
import User from "../models/User.js"

const router = express.Router()

// GET all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({
            message: "Failed to get users.",
            error: error.message
        })
    }
})

// GET user by Id for Login
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.body.userId })

        if (!user) {
            return res.status(404).json({
                message: "Oops! We couldn't find an account with that User ID."
            })
        }

        if (user.password !== req.body.password) {
            return res.status(401).json({
                message: "Login failed. Password does not match."
            })
        }

        res.status(200).json({
            message: "Login successful!",
            user: {
                userId: user.userId,
                username: user.username,
                class: user.class,
                role: user.role
            }
        })  
    } catch (error) {
        res.status(500).json({
            message: "Failed to get user.",
            error: error.message
        })
    }
})

// POST new user for Signup
router.post("/", async (req, res) => {
    try {
        const existingUser = await User.findOne({ userId: req.body.userId })
        
        if (existingUser) {
            return res.status(400).json({
                message: "User ID already exists!"
            })
        }

        const newUser = new User(req.body)
        const savedUser = await newUser.save()
        
        res.status(201).json({
            message: "New user created successfully!",
            user: {
                userId: savedUser.userId,
                username: savedUser.username,
                class: savedUser.class,
                role: savedUser.role
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to create new user.",
            error: error.message
        })
    }
})

export default router