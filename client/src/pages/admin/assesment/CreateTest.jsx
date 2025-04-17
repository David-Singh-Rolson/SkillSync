

import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateAssessmentMutation } from "@/features/api/assessmentApi";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CreateTest = () => {
  
    const [input, setInput] = useState({
        testTitle: "",
        testDescription: "",
        instruction: "",
        category: "",
        testLevel: "",
        testType: "",
        timeLimit: "",
        totalMarks: "",
      });

  const params = useParams();
  const testId = params.testId;
//   const { data: courseByIdData, isLoading: courseByIdLoading , refetch} =
    // useGetCourseByIdQuery(courseId);

    const [createAssessment,{data,error,isSuccess,isLoading}]=useCreateAssessmentMutation();

    // const [publishCourse, {}] = usePublishCourseMutation();
 
//   useEffect(() => {
//     if (courseByIdData?.course) { 
//         const course = courseByIdData?.course;
//       setInput({
//         courseTitle: course.courseTitle,
//         subTitle: course.subTitle,
//         description: course.description,
//         category: course.category,
//         courseLevel: course.courseLevel,
//         coursePrice: course.coursePrice,
//         courseThumbnail: "",
//       });
//     }
//   }, [courseByIdData]);

  const navigate = useNavigate();

//   const [editCourse, { data, isLoading, isSuccess, error }] =
//     useEditCourseMutation();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };
  const selectTestLevel = (value) => {
    setInput({ ...input, testLevel: value });
  };
  const selectTestType = (value) => {
    setInput({ ...input, testType: value });
  };
 

//   const updateTestHandler = async () => {
//     const formData = new FormData();
//     formData.append("testTitle", input.testTitle);
//     formData.append("description", input.description);
//     formData.append("instruction", input.instruction);
//     formData.append("category", input.category);
//     formData.append("testLevel", input.testLevel);
//     formData.append("testType", input.testType);
//     formData.append("timeLimit", input.timeLimit);
//     formData.append("totalMarks", input.totalMarks);

//     await editCourse({ formData, courseId });
//   };

  const CreateAssessmentHandler= async ()=>{
        // console.log(input);
        const res = await createAssessment({...input})
        console.log(res);
        
  }
//   const publishStatusHandler = async (action) => {
//     try {
//       const response = await publishCourse({courseId, query:action});
//       if(response.data){
//         refetch();
//         toast.success(response.data.message);
//       }
//     } catch (error) {
//       toast.error("Failed to publish or unpublish course");
//     }
//   }

//   useEffect(() => {
//     if (isSuccess) {
//       toast.success(data.message || "Course update.");
//     }
//     if (error) {
//       toast.error(error.data.message || "Failed to update course");
//     }
//   }, [isSuccess, error]);

//   if(courseByIdLoading) return <h1>Loading...</h1>
 
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Test Information</CardTitle>
          <CardDescription>
            Make changes to your Test here. Click save when you're done.
          </CardDescription>
        </div>
        <div className="space-x-2">
          {/* <Button disabled={courseByIdData?.course.lectures.length === 0} variant="outline" onClick={()=> publishStatusHandler(courseByIdData?.course.isPublished ? "false" : "true")}>
            {courseByIdData?.course.isPublished ? "Unpublished" : "Publish"}
          </Button> */}
          <Button>Remove Test</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="testTitle"
              value={input.testTitle}
              onChange={changeEventHandler}
              placeholder="Ex. DBMS"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              type="text"
              name="testDescription"
              value={input.testDescription}
              onChange={changeEventHandler}
              placeholder="Ex. DBMS"
            />
          </div>
          {/* <div>
            <Label>Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Become a Fullstack developer from zero to hero in 2 months"
            />
          </div> */}
          <div>
            <Label>Instructions</Label>
            <RichTextEditor input={input} setInput={setInput} field="instruction"/>
          </div>
          <div className="flex items-center gap-5">
            <div>
              <Label>Category</Label>
              <Select
                defaultValue={input.category}
                onValueChange={selectCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Next JS">Next JS</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Frontend Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="Fullstack Development">
                      Fullstack Development
                    </SelectItem>
                    <SelectItem value="MERN Stack Development">
                      MERN Stack Development
                    </SelectItem>
                    <SelectItem value="Javascript">Javascript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Test Level</Label>
              <Select
                defaultValue={input.courseLevel}
                onValueChange={selectTestLevel}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Test level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Test Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Test Type</Label>
              <Select
                defaultValue={input.testType}
                onValueChange={selectTestType}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Test Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Test Type</SelectLabel>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                    <SelectItem value="Topic-wise">Topic Wise</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Time Limit (Mins)</Label>
              <Input
                type="number"
                name="timeLimit"
                value={input.timeLimit}
                onChange={changeEventHandler}
                placeholder="20"
                className="w-fit"
              />
            </div>
            <div>
              <Label>Total Marks</Label>
              <Input
                type="number"
                name="totalMarks"
                value={input.totalMarks}
                onChange={changeEventHandler}
                placeholder="20"
                className="w-fit"
              />
            </div>
          </div>
          {/* <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="e-64 my-2"
                alt="Course Thumbnail"
              />
            )}
          </div> */}
          <div>
            <Button onClick={() => navigate("/admin/assessment")} variant="outline">
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={CreateAssessmentHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateTest;



