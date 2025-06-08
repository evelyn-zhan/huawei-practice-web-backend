import mongoose from "mongoose"

const studentClassSchema = new mongoose.Schema({
    name: { type: String, required: true },
    academicYear: { type: String, required: true },
    isArchived: { type: Boolean, required: true }
}, { timestamps: false })

const studentClass = mongoose.model("StudentClass", studentClassSchema)

export default studentClass