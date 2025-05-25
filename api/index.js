import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"

import userRoutes from "../routes/user.js"

dotenv.config()

// Initialize Express app
const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// MongoDB Connection
mongoose
.connect(process.env.MONGO_URI, { dbName: "huawei-practice-web" })
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.log(`MongoDB connection error: ${error}`))

// Routes
app.use("/api/user", userRoutes)

// Start the server
const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`))