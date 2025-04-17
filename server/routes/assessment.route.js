import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { CreateAssessment } from "../controllers/assessment.controllers.js";

const router = express.Router();

router.route("/").post(isAuthenticated,CreateAssessment);


export default router;