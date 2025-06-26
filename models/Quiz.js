import mongoose from "mongoose"

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    questionCount: { type: Number, required: true },
    questions: { type: [Object], required: true },
    type: { type: String, required: true },
    time: { type: Number, required: true }
}, { timestamps: false })

const Quiz = mongoose.model("Quiz", quizSchema)

export default Quiz