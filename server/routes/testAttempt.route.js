import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getQuestionForAttempt } from "../controllers/testAttempt.controller.js";
import { submitTestAttempt } from "../controllers/testAttempt.controller.js";
const router = express.Router();
router.route("/").post(isAuthenticated,getQuestionForAttempt);
router.route("/submit/:attemptId").post(isAuthenticated,submitTestAttempt);

export default router;