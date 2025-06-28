import express from "express"

import Quiz from "../models/Quiz.js"

const router = express.Router()

// GET all assignments
router.get("/", async (req, res) => {
    try {
        const assignments = await Quiz.find({ title: { $ne: "-" } })
        res.status(200).json(assignments)
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error! Failed to get assignments.",
            error: error.message
        })
    }
})

export default router