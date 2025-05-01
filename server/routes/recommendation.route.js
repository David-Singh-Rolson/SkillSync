import express from "express";
import { getUserRecommendations } from "../controllers/recommendation.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/recommendation/user").get(isAuthenticated,getUserRecommendations);

export default router;
