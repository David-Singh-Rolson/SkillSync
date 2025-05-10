"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  CalendarDays,
  Clock,
  GraduationCap,
  BookOpen,
  User,
  CheckCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TestAlert from "./TestAlert";

const AssessmentCard = ({ assessment, role }) => {
  const navigate = useNavigate();
  // console.log("newsss", assessment);

  if (!assessment) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No assessment data available.
      </div>
    );
  }

  const now = new Date();
  const start = null,
    end = null,
    isTestActive = true;
  if (assessment?.startTime && assessment?.endTime) {
    start = new Date(assessment?.startTime);
    end = new Date(assessment?.endTime);
    isTestActive = now >= start && now <= end;
  }

  const getLevelBadgeColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-emerald-500 hover:bg-emerald-600";
      case "Medium":
        return "bg-amber-500 hover:bg-amber-600";
      default:
        return "bg-rose-600 hover:bg-rose-700";
    }
  };

  const badgeColor = getLevelBadgeColor(assessment.testLevel);

  return (
    <Card
      key={assessment._id}
      className="overflow-hidden rounded-xl border border-border/40 shadow-md  hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-full"
    >
      <CardHeader className="pb-2 space-y-1">
        <div className="flex justify-between items-start">
          <h2 className="font-bold text-xl line-clamp-1 hover:underline cursor-pointer">
            {assessment.testTitle}
          </h2>
          <Badge className={`${badgeColor} text-white font-medium`}>
            {assessment.testLevel}
          </Badge>
        </div>

        <div className="flex flex-col space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Course: {assessment.course.courseTitle || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Type: {assessment.testType || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCheck className="h-3.5 w-3.5" />
            <span>
              Attempts:{" "}
              {(assessment?.isSingleAttempt) === true
                ? "Single"
                : assessment?.isSingleAttempt === false
                ? "Multiple"
                : "N/A"}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3 pt-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Created by:</span>
            <span className="font-medium">
              {assessment?.createdBy?.name || "Unknown"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-muted/50 p-3 rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>Start Time</span>
              </div>
              <p className="text-xs font-medium">
                {start?.toLocaleString() || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>End Time</span>
              </div>
              <p className="text-xs font-medium">
                {end?.toLocaleString() || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <TestAlert
          onContinue={() =>
            navigate(
              `/assessment-detail/${assessment._id}?type=${assessment.testType}&level=${assessment.testLevel}`
            )
          }
          startTime={assessment?.startTime || "N/A"}
          endTime={assessment?.endTime || "N/A"}
          disabled={!isTestActive}
        >
          <Button
            disabled={role === "instructor"}
            className={`w-full ${
              isTestActive
                ? "bg-green-500 hover:bg-green-600"
                : "bg-green-400 hover:bg-green-500"
            }`}
          >
            {isTestActive ? "Attempt Now" : "Attempt"}
          </Button>
        </TestAlert>
      </CardFooter>
    </Card>
  );
};

export default AssessmentCard;
