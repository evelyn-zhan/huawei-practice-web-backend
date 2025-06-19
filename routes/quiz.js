import express from "express"

import Question from "../models/Question.js"
import Quiz from "../models/Quiz.js"

const router = express.Router()

// POST new quiz
router.post("/", async (req, res) => {
    const { title, questionCount } = req.body

    try {
        const singleAnswerMultipleChoiceQuestions = await Question.aggregate([
            { $match: { type: "single-answer-multiple-choice" } },
            { $sample: { size: Math.max(1, parseInt(0.4 * questionCount)) } }
        ])
        
        const multipleAnswerMultipleChoiceQuestions = await Question.aggregate([
            { $match: { type: "multiple-answer-multiple-choice" } },
            { $sample: { size: Math.max(1, parseInt(0.3 * questionCount)) } }
        ])

        const trueOrFalseQuestions = await Question.aggregate([
            { $match: { type: "true-or-false" } },
            { $sample: { size: Math.max(1, parseInt(0.2 * questionCount)) } }
        ])
        
        const wordAnswerQuestions = await Question.aggregate([
            { $match: { type: "single-word-answer" } },
            { $sample: { size: questionCount - singleAnswerMultipleChoiceQuestions.length - multipleAnswerMultipleChoiceQuestions.length - trueOrFalseQuestions.length } }
        ])
        
        const questions = [
            ...singleAnswerMultipleChoiceQuestions,
            ...multipleAnswerMultipleChoiceQuestions,
            ...trueOrFalseQuestions,
            ...wordAnswerQuestions
        ]

        const newQuiz = new Quiz({ title, questionCount, questions })
        const savedQuiz = await newQuiz.save()

        res.status(201).json({
            message: "New quiz created successfully!",
            quiz: savedQuiz
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error! Failed to create new quiz.",
            error: error.message
        })
    }
})

export default router