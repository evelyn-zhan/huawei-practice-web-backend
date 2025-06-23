import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    classId: { type: String, default: null },
    role: { type: String, required: true },
    password: { type: String, required: true }
}, { timestamps: false })

const User = mongoose.model("User", userSchema)

export default User