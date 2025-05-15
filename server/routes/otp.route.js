import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { SendOtpMail,verifyOtp } from "../controllers/otp.controller.js";

const router = express.Router();

router.route("/send").post(SendOtpMail);
router.route("/verify").post(verifyOtp);



export default router;
