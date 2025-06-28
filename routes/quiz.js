import express from "express"

import Question from "../models/Question.js"
import Quiz from "../models/Quiz.js"
import QuizAttempt from "../models/QuizAttempt.js"

const router = express.Router()

// POST new quiz
router.post("/", async (req, res) => {
    const { title, questionCount, type, time } = req.body

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

        const newQuiz = new Quiz({ title, questionCount, questions, type, time })
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

// POST new quiz attempt
router.post("/:id", async (req, res) => {
    const { id } = req.params
    const { userId, score } = req.body

    try {
        const newQuizAttempt = new QuizAttempt({ quizId: id, userId, score })
        const savedQuizAttempt = await newQuizAttempt.save()

        res.status(200).json({
            message: "Woohoo! You have done a quiz!",
            quizAttempt: savedQuizAttempt
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error!",
            error: error.message
        })
    }
})

// GET quiz by id
router.get("/:id", async (req, res) => {
    const { id } = req.params

    try {
        const quiz = await Quiz.findOne({ _id: id })
        res.status(200).json({
            message: "Quiz found!",
            quiz
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error! Failed to get quiz.",
            error: error.message
        })
    }
})

// GET quizzes by userId and quizId
router.get("/", async (req, res) => {
    const { userId, quizId } = req.query

    let filter = {}

    if (userId) {
        filter.userId = userId
    }

    if (quizId) {
        filter.quizId = quizId
    }

    try {
        const attemptedQuizzes = await QuizAttempt.find(filter)
        res.status(200).json(attemptedQuizzes)
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error! Failed to get attempted quizzes.",
            error: error.message
        })
    }
})

// GET all assignments
router.get("/assignment", async (req, res) => {
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