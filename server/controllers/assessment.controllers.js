import { Test } from "../models/test.model.js";

export const CreateAssessment=async (req, res) =>{
    try {
        // console.log(req.body)
        const {testTitle,testDescription,instructions,category,testType,timeLimit,totalMarks,testLevel, startTime,
            endTime,isScheduled,}=req.body;
        if(!testTitle || !testType || !timeLimit || !testLevel ||  !testDescription || !instructions || !category || !totalMarks ||  !startTime ||
            !endTime || !isScheduled){
                return res.status(400).json({
                    message:"All fields are required!"
                })
        }


        const test=await Test.create({
            testTitle,
            testDescription,
            instructions,
            category,
            testLevel,
            testType,
            timeLimit,
            totalMarks,
            startTime,
            endTime,
            isScheduled,
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

export const getAllCreatorAssessments= async (req,res) =>{
    try {
        const userId=req.id;
        const tests= await Test.find({createdBy:userId}).sort({ createdAt: -1 });
        if(!tests){
            return res.status(404).json({
                tests:[],
                message:"No Assessment Found"
            })
        }
        return res.status(200).json({
            tests
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get Assessment!"
        })
    }
}