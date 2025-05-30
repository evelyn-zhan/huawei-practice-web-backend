import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    formattedQuestion: { type: String },
    year: { type: Number, required: true },
    type: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: [String], required: true },
    score: { type: Number, required: true }
}, { timestamps: false })

const Question = mongoose.model("Question", questionSchema)

export default Question