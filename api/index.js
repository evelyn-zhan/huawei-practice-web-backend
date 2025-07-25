import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import session from "express-session"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"

import userRoutes from "../routes/user.js"
import questionRoutes from "../routes/question.js"
import classRoutes from "../routes/class.js"
import quizRoutes from "../routes/quiz.js"
import assignmentRoutes from "../routes/assignment.js"

dotenv.config()

// Initialize Express app
const app = express()

// Middlewares
app.use(cors())

app.use(express.json())
app.use(cookieParser())

app.use(session({
    name: "sid",
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}))

// MongoDB Connection
mongoose
.connect(process.env.MONGO_URI, { dbName: "huawei-practice-web" })
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.log(`MongoDB connection error: ${error}`))

// Routes
app.use("/api/user", userRoutes)
app.use("/api/question", questionRoutes)
app.use("/api/class", classRoutes)
app.use("/api/quiz", quizRoutes)
app.use("/api/assignment", assignmentRoutes)

// Start the server
const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`))