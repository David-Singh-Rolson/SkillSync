import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
import assessmentRoute from "./routes/assessment.route.js"
import questionRoute from "./routes/question.route.js"
import testAttemptRoute from "./routes/testAttempt.route.js"
import recommendationRoute from "./routes/recommendation.route.js"
import generateMCQRoute from "./routes/mcqBuilder.route.js"
import performanceRoute from "./routes/performance.route.js"
dotenv.config({});

// call database connection here
connectDB();
const app = express();

const PORT = process.env.PORT || 3000;

// default middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
 
// apis
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);
app.use("/api/v1/assessment", assessmentRoute);
app.use("/api/v1/question", questionRoute);
app.use("/api/v1/test/attempt", testAttemptRoute);
app.use("/api/v1", recommendationRoute);
app.use("/api/v1", generateMCQRoute);
app.use("/api/v1", performanceRoute);
 // 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
  });
 
app.listen(PORT, () => {
    console.log(`Server listen at port ${PORT}`);
})


