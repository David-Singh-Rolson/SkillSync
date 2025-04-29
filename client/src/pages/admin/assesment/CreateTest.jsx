import { DatePicker } from "@/components/DatePicker";
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";
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
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";

const CreateTest = () => {
  // const courseList = useSelector((state) => state.auth.user?.role); course slice bnna pdega
  const {
    data: publishedCourseData,
    isLoading: publishedCourseIsLoading,
    isError,
  } = useGetPublishedCourseQuery();


  const [input, setInput] = useState({
    testTitle: "",
    testDescription: "",
    instructions: "",
    // category: "",
    testLevel: "",
    testType: "",
    timeLimit: "",
    course: "",
    totalMarks: "",
    startTime: "",
    endTime: "",
    isScheduled: "",
  });



  const params = useParams();
  const testId = params.testId;

  const [createAssessment, { data, error, isSuccess, isLoading }] =
    useCreateAssessmentMutation();

  const navigate = useNavigate();

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
  const selectScheduleType = (value) => {
    setInput({ ...input, isScheduled: value === "Timed" });
  };

  const CreateAssessmentHandler = async () => {
console.log("input",input);

    try {
      const res = await createAssessment({ ...input }).unwrap(); // unwrap to get actual response
      toast.success("Assessment Created Successfully");
      navigate("/admin/assessment");
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Test Information</CardTitle>
          <CardDescription>
            Make changes to your Test here. Click save when you're done.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {publishedCourseIsLoading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-4 mt-5 ">
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
            <div>
              <Label>Instructions</Label>
              <RichTextEditor
                input={input}
                setInput={setInput}
                field="instructions"
              />
            </div>
            <div className="flex items-center gap-5 flex-wrap">
               
                <div>
                  <Label>Course</Label>
                  <Select
                    value={input.course}
                    onValueChange={(value) =>
                      setInput({ ...input, course: value })
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a Course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Courses</SelectLabel>
                        {publishedCourseData?.courses?.map((course) => (
                          <SelectItem key={course._id} value={course._id}>
                            {course.courseTitle}
                          </SelectItem>
                        ))}
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
                      <SelectItem value="Topic">Topic Wise</SelectItem>
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
              <div>
                <Label>Scheduled</Label>
                <Select
                  defaultValue={input.isScheduled}
                  onValueChange={selectScheduleType}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Schedule Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Schedule Type</SelectLabel>
                      <SelectItem value="Timed">Timed</SelectItem>
                      <SelectItem value="Always">Always Available</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1">
                <Label>Start Time</Label>
                <DatePicker
                  disabled={!input.isScheduled}
                  value={input.startTime}
                  onChange={(date) =>
                    setInput((prev) => ({ ...prev, startTime: date }))
                  }
                />
                {!input.isScheduled && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Select "Timed" to enable scheduling.
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1">
                <Label>End Time</Label>
                <DatePicker
                  disabled={!input.isScheduled}
                  value={input.endTime}
                  onChange={(date) =>
                    setInput((prev) => ({ ...prev, endTime: date }))
                  }
                />
                {!input.isScheduled && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Select "Timed" to enable scheduling.
                  </p>
                )}
              </div>
            </div>
            <div>
              <Button
                onClick={() => navigate("/admin/assessment")}
                variant="outline"
              >
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
        )}
      </CardContent>
    </Card>
  );
};

export default CreateTest;
