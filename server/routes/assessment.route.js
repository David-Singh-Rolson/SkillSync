import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { CreateAssessment, getAllCreatorAssessments } from "../controllers/assessment.controllers.js";

const router = express.Router();

router.route("/").post(isAuthenticated,CreateAssessment);
router.route("/").get(isAuthenticated,getAllCreatorAssessments);



export default router;