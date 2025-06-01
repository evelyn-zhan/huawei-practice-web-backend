import express from "express"
import bcrypt from "bcrypt"
import User from "../models/User.js"

const router = express.Router()

// GET users by year and class
router.get("/", async (req, res) => {
    const { year } = req.query
    let { className } = req.query

    if (className === "if-a-pagi") className = "IF-A Pagi"
    else if (className === "if-b-pagi") className = "IF-B Pagi"
    else if (className === "if-c-pagi") className = "IF-C Pagi"
    else if (className === "if-a-sore") className = "IF-A Sore"
    else if (className === "if-b-sore") className = "IF-B Sore"
    else if (className === "if-c-sore") className = "IF-C Sore"

    let filter = {}
    if (year) filter.userId = new RegExp(`^${year.slice(-2)}`)
    if (className) filter.class = className

    try {
        const users = await User.find(filter)
        res.status(200).json(users)
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to get users.",
            error: error.message
        })
    }
})

// POST user credentials for Login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.body.userId })

        if (!user) {
            return res.status(404).json({
                message: "Oops! We couldn't find an account with that User ID."
            })
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password)
        
        if (!isMatch) {
            return res.status(401).json({
                message: "Login failed. Password does not match."
            })
        }

        req.session.user = {
            userId: user.userId,
            username: user.username,
            class: user.class,
            role: user.role
        }

        res.status(200).json({
            message: "Login successful!",
            user: req.session.user
        })  
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to get user.",
            error: error.message
        })
    }
})

// POST for Logout
router.post("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                message: "Logout failed.",
                error: error.message
            })
        }

        res.clearCookie("sid")
        res.status(200).json({
            message: "Logout successful!"
        })
    })
})

// POST new user for Signup
router.post("/signup", async (req, res) => {
    try {
        const existingUser = await User.findOne({ userId: req.body.userId })
        
        if (existingUser) {
            return res.status(400).json({
                message: "User ID already exists!"
            })
        }

        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)

        const newUser = new User({ ...req.body, password: hashedPassword })
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
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to create new user.",
            error: error.message
        })
    }
})

export default router