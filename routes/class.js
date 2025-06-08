import express from "express"
import StudentClass from "../models/StudentClass.js"

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const classes = await StudentClass.find()
        res.status(200).json(classes)
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error! Failed to get classes.",
            error: error.message
        })
    }
})

router.post("/", async (req, res) => {
    const { name, academicYear } = req.body

    try {
        const existingClass = await StudentClass.findOne({ name, academicYear })

        if (existingClass) {
            return res.status(400).json({
                message: "Class already exists!"
            })
        }

        const newClass = new StudentClass({ name, academicYear, isArchived: false })
        const savedClass = await newClass.save()

        res.status(201).json({
            message: "New class created successfully!",
            studentClass: savedClass
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error! Failed to create new class.",
            error: error.message
        })
    }
})

export default router