import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { CreateAssessment, getAllCreatorAssessments ,addQuestionInAssessment} from "../controllers/assessment.controllers.js";

const router = express.Router();

router.route("/").post(isAuthenticated,CreateAssessment);
router.route("/").get(isAuthenticated,getAllCreatorAssessments);
router.route("/:assessmentId").put(isAuthenticated,addQuestionInAssessment);



export default router;