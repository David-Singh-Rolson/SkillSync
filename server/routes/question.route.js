import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {createQuestion} from "../controllers/question.controller.js"

const router = express.Router();

router.route("/").post(isAuthenticated,createQuestion)

export default router