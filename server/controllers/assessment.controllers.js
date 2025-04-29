import { Test } from "../models/test.model.js";

export const CreateAssessment=async (req, res) =>{
    try {
        console.log(req.body)
        const {testTitle,testDescription,instructions,course,testType,timeLimit,totalMarks,testLevel, startTime,
            endTime,isScheduled,}=req.body;
        if(!testTitle || !testType || !timeLimit || !testLevel ||  !testDescription || !instructions || !course || !totalMarks  || isScheduled){
                return res.status(400).json({
                    message:"All fields are required!"
                })
        }


        // Prepare testData object
    const testData = {
        testTitle,
        testDescription,
        instructions,
        course, // corrected category name
        testLevel,
        testType,
        timeLimit,
        totalMarks,
        isScheduled,
        createdBy: req.id,
      };

      
    // Only if scheduled, include startTime and endTime
    if (isScheduled) {
        if (!startTime || !endTime) {
          return res.status(400).json({
            message: "Start Time and End Time are required for scheduled assessments!",
          });
        }
        testData.startTime = startTime;
        testData.endTime = endTime;
      }

        const test=await Test.create(testData);
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

export const addQuestionInAssessment=async (req,res) =>{
    try {
        const { assessmentId } = req.params;
        const { questionId } = req.body;
        // const {assessmentId,questionId}=req.body
        console.log("ass id from add ques in ass contr",assessmentId);
        console.log("ques id from add ques in ass contr",questionId);
        
        if (!assessmentId || !questionId) {
            return res.status(400).json({
              message: "assessmentId and questionId are required",
            });
          }
          const assessment = await Test.findByIdAndUpdate(
            assessmentId,
            { $push: { questions: questionId } },
            { new: true }
          ).populate("questions");
        if(!assessment){
            return res.status(404).json({
                assessment:[],
                message:"No Assessment Found"
            })
        }
        return res.status(200).json({
            assessment,
            message: "Question added to assessment successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to add question in assessment!"
        })
        
    }
}

export const getAddedQuestionsInAssessment=async (req,res)=>{
    try {
        const { assessmentId } = req.params;
        if (!assessmentId ) {
            return res.status(400).json({
                message: "assessmentId is required!",
                });
        }
        const assessment=await Test.findById(assessmentId).populate("questions").exec();
        if(!assessment){
            return res.status(404).json({
                message:"Assessment id not found!"
            })
        }
        return res.status(200).json({
            assessment
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get assessment"
        })
        
    }
}

export const togglePublishAssessment=async (req,res) =>{
    try {

        const {assessmentId}=req.params;
        const {publish}=req.query;
        const assessment=await Test.findById(assessmentId)
        if (!assessment) {
            return res.status(404).json({
                message:"Assessment not found!"
            });
        }

        assessment.isPublished=publish==="true";
        await assessment.save();

        const statusMessage = assessment.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            message:`Assessment is ${statusMessage}`
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to update status"
        })
    }
}

// get Assessment by assessmentId

export const getAssessmentById=async (req,res)=>{
    try {
        const {assessmentId}=req.params;
        const assessment=await Test.findById(assessmentId);
        if(!assessment){
            return res.status(404).json({
                message:"Assessment not found!"
            })
        }
        return res.status(200).json({
            assessment
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get assessment!"
        })
    }
}

export const getAllPublishedAssessment = async (req, res) => {
    try {
      // Fetch all published tests
      const assessments = await Test.find({ isPublished: true })
        .populate("createdBy", "name");
  
      if (assessments.length === 0) {
        return res.status(404).json({ message: "No published assessments found." });
      }
  
      return res.status(200).json({
        assessments,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Failed to fetch published assessments!",
      });
    }
  };
  