import { Post } from "../models/forumPost.model.js";

export const createForum=async (req ,res)=>{
    try {

        const {postTitle,postContent,tags,participants,role,user}=req.body;
        if(!postTitle || !postContent || !tags || !participants || !role || !user ){
            return res.status(400).json({
                message:"All fields are required!"
            });
        }
        const forumData={postTitle,postContent,tags,participants,role,createdBy: user}
        const result=await Post.create(forumData);
        return res.status(201).json({
            message:"Post Crteated Successfully",
            post:result
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create Forum Post!"
        })
    }
}

export const getAllForumPost=async (req,res)=>{
    try {
        const posts=await Post.find().sort({createdAt:-1});
        if(!posts){
            return res.status(404).json({
                message:"Post not found"
            })
        }
        return res.status(200).json({
            message:"Success",
            posts
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get Forum Posts!"
        })
    }
}

export const getPostDetailsById=async (req ,res)=>{
    try {
        const {postId}=req.params
        const post =await Post.findById(postId).populate("createdBy", "name photoUrl role")
        .populate({
        path: "commentIds", 
        populate: [
          {
            path: "commentedBy",
            select: "name photoUrl role",
          },
        //   {
        //     path: "replyIds",
        //     populate: {
        //       path: "repliedBy",
        //       select: "name photoUrl role",
        //     },
        //   },
        ],
      });
        if(!post){
            return res.status(404).json({message:"Post not found!"})
        }
        return res.status(200).json({
            message:"Found post details",
            post
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get post Details by id"
        })
    }
}