import mongoose from "mongoose"

const quizAttemptSchema = new mongoose.Schema({
    quizId: { type: String, required: true },
    userId: { type: String, required: true },
    score: { type: Number, required: true }
})

const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema)

export default QuizAttempt