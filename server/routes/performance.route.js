import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {getPerformance} from "../controllers/performance.controller.js"
const router = express.Router();
router.route("/").post(isAuthenticated,getPerformance);







export default router;
