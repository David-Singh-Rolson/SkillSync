import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { CreateAssessment, getAllCreatorAssessments ,addQuestionInAssessment,getAddedQuestionsInAssessment, togglePublishAssessment,getAssessmentById,getAllPublishedAssessment} from "../controllers/assessment.controllers.js";

const router = express.Router();

router.route("/").post(isAuthenticated,CreateAssessment);
router.route("/").get(isAuthenticated,getAllCreatorAssessments);
router.route("/:assessmentId").put(isAuthenticated,addQuestionInAssessment);
router.route("/:assessmentId/questions").get(isAuthenticated,getAddedQuestionsInAssessment);
router.route("/:assessmentId").patch(isAuthenticated,togglePublishAssessment);
router.route("/:assessmentId").get(isAuthenticated,getAssessmentById);
router.route("/published/assessments").get(isAuthenticated,getAllPublishedAssessment);



export default router;