import express from "express"
import bcrypt from "bcrypt"
import User from "../models/User.js"
import StudentClass from "../models/StudentClass.js"

const router = express.Router()

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

        const studentClass = await StudentClass.findOne({ _id: user.classId })

        req.session.user = {
            userId: user.userId,
            username: user.username,
            studentClass: studentClass ? studentClass.name : null,
            role: user.role
        }

        res.status(200).json({
            message: "Login successful!",
            user: req.session.user
        })  
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error! Failed to get user.",
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

        const newUser = new User({ ...req.body, classId: null, password: hashedPassword })
        const savedUser = await newUser.save()
        
        res.status(201).json({
            message: "New user created successfully!",
            user: {
                userId: savedUser.userId,
                username: savedUser.username,
                role: savedUser.role
            }
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Internal servor error! Failed to create new user.",
            error: error.message
        })
    }
})

// PUT user to update student's class
router.put("/join-class", async (req, res) => {
    const { classId } = req.body

    try {
        const user = await User.findOne({ userId: req.session.user.userId })

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            })
        }

        user.classId = classId
        const updatedUser = await user.save()

        res.status(200).json({
            message: "User joined class successfully!",
            user: updatedUser
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error! Failed to join class.",
            error: error.message
        })
    }
})

// GET users by year and class
router.get("/", async (req, res) => {
    const { year, classId } = req.query

    let filter = {}
    if (year) filter.userId = new RegExp(`^${year.slice(-2)}`)
    if (className) filter.classId = StudentClass.findOne({ _id: classId })

    try {
        const users = await User.find(filter)
        res.status(200).json(users)
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error! Failed to get users.",
            error: error.message
        })
    }
})

export default router