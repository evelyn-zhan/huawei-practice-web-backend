import express from "express"
import Question from "../models/Question.js"

const router = express.Router()

// GET all questions
router.get("/", async (req, res) => {
    try {
        const questions = await Question.find()
        res.status(200).json(questions)
    } catch (error) {
        res.status(500).json({
            message: "Failed to get questions.",
            error: error.message
        })
    }
})

// POST new question
router.post("/", async (req, res) => {
    try {
        const { question, year, type, options, answer, score } = req.body

        const formattedQuestion = question.toLowerCase().replace(" ", "")
        const existingQuestion = await Question.findOne({ formattedQuestion })

        if (existingQuestion) {
            res.status(400).json({
                message: "Question already exists!"
            })
        }

        const newQuestion = new Question({ question, formattedQuestion, yeaar, type, options, answer, score })
        const savedQuestion = await newQuestion.save()

        res.status(201).json({
            message: "New question created successfully!",
            question: savedQuestion
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to create new question.",
            error: error.message
        })
    }
})

export default router