import {TestAttempt} from "../models/testAttempt.model.js"


export const getLatestTestResult = async (req, res) => {
    try {
        const userId = req.body.userId;

        const result = await TestAttempt.findOne({ userId: userId,status: 'Submitted' }).sort({ createdAt: -1 }).exec();

        if (!result) {
            return res.status(404).json({ message: "Test result not found" });
        }

        return res.status(200).json({
            message:"Latest Test result fetched",
            result
        });

    } catch (error) {
        console.error("getLatestTestResult error:", error.message, error.stack);

        return res.status(500).json({ message: "Internal server error in fetching performance" });
    }
};