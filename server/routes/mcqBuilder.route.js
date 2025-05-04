import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { generateMcqWithAI } from "../controllers/mcqBuilder.controller.js";

const router = express.Router();

router.route("/mcq-builder").post(isAuthenticated, generateMcqWithAI);

export default router;
