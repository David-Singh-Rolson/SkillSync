import express from "express";
import isAuthenticated from "../../../middlewares/isAuthenticated.js";
import { createComment,getCommentByPostId } from "../controllers/comment.controller.js";
const router = express.Router();


router.route("/create").post(isAuthenticated,createComment);
router.route("/get/all/:postId").get(isAuthenticated,getCommentByPostId);



export default router;
