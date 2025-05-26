import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    formattedQuestion: { type: String },
    type: { type: String, required: true },
    options: { type: [String] },
    answer: { type: [String], required: true },
    score: { type: Number, required: true }
}, { timestamps: false })

const Question = mongoose.model("Question", questionSchema)

export default Question