import express from "express"
import Question from "../models/Question.js"

const router = express.Router()

// POST new question
router.post("/", async (req, res) => {
    try {
        const { question, type, options, answer, score } = req.body

        const formattedQuestion = question.trim().toLowerCase()
        const existingQuestion = await Question.findOne({ formattedQuestion })

        if (existingQuestion) {
            res.status(400).json({
                message: "Question already exists!"
            })
        }

        res.status(201).json({
            message: "New question created successfully!",
            question: { question, formattedQuestion, type, options, answer, score }
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to create new question.",
            error: error.message
        })
    }
})

export default router