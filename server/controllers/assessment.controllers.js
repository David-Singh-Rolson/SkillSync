import { Test } from "../models/test.model.js";
export const CreateAssessment=async (req, res) =>{
    try {
        console.log(req.body)
        const {testTitle,testType,timeLimit}=req.body;
        if(!testTitle || !testType || !timeLimit){
            return res.status(400).json({
                message:"All fields are required!"
            })
        }

        const test=await Test.create({
            testTitle,
            testType,
            timeLimit,
            createdBy: req.id
        });
        return res.status(201).json({test,message:"Assessment Created"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create Assessment!"
        })
        
        
    }
}