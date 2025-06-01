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

        const formattedQuestion = question.toLowerCase().replace(/\s+/g, "")
        const existingQuestion = await Question.findOne({ formattedQuestion })

        if (existingQuestion) {
            return res.status(400).json({
                message: "Question already exists!"
            })
        }

        const newQuestion = new Question({ question, formattedQuestion, year, type, options, answer, score })
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

// PUT (Update or Edit) question
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { question, year, type, options, answer, score } = req.body

        const formattedQuestion = question.toLowerCase().replace(/\s+/g, "")

        const updatedQuestion = await Question.findOneAndUpdate(
            { _id: id },
            { question, formattedQuestion, year, type, options, answer, score },
            { new: true }
        )

        res.status(200).json({
            message: "Question updated successfully!",
            updatedQuestion
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to update question.",
            error: error.message
        })
    }
})

// DELETE question
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params

        const deletedQuestion = await Question.findOneAndDelete({ _id: id })

        res.status(200).json({
            message: "Question deleted successfully!",
            deletedQuestion
        })
    } catch (error) {

    }
})

export default router