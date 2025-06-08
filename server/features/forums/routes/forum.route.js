import express from "express";
import isAuthenticated from "../../../middlewares/isAuthenticated.js";

import { createForum,getAllForumPost, getPostDetailsById } from "../controllers/post.controller.js";

const router = express.Router();

router.route("/create").post(isAuthenticated,createForum);
router.route("/get/all/posts").get(isAuthenticated,getAllForumPost);
router.route("/post/details/:postId").get(isAuthenticated,getPostDetailsById);

export default router;
