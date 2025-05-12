import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {getLatestTestResult} from "../controllers/performance.controller.js"
const router = express.Router();
router.route("/").post(isAuthenticated,getLatestTestResult);







export default router;
