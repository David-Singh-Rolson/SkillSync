// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import TestAlert from "./TestAlert";
// const QuestionCard = ({ assessment, role }) => {
//   if (!assessment || !assessment.assessments) {
//     return <div>No assessments available.</div>;
//   }
//   const navigate = useNavigate();

//   const [showAlert, setShowAlert] = useState(false);

//   const { assessments } = assessment;
//   console.log("role in card", role);

//   return (
//     <div className="flex flex-row gap-5 w-max">
//       {assessments?.map((ass) => (
//         // <Link >
//         <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 pt-5">
//           <div className="relative pl-4">
//             <h1 className="hover:underline font-bold text-lg truncate">
//               <text>{ass.testTitle}</text>
//             </h1>
//             <h1 className="font-medium text-sm">
//               Course : {ass.course || "N/A"}
//             </h1>
//             <h1 className="font-medium text-sm">
//               Test Type : {ass.testType || "N/A"}
//             </h1>
//           </div>
//           <CardContent className="px-5 py-4 space-y-3">
//             <div className="flex items-center justify-around gap-3">
//               <div className="flex items-center gap-3 flex-row">
//                 <text>Created By</text>
//                 <h1 className="font-medium text-sm">{ass?.createdBy?.name}</h1>
//               </div>
//             </div>
//             <div>
//               <h4>Start Time</h4>
//               <h4>{ass.startTime}</h4>
//             </div>
//             <div>
//               <h4>End Time</h4>
//               <h4>{ass.endTime}</h4>
//             </div>
//             <div className="text-lg font-bold flex flex-row gap-3 justify-around">
//               <Badge
//                 className={`text-white px-2 py-1 text-xs rounded-full ${
//                   ass.testLevel === "Beginner"
//                     ? "bg-green-500"
//                     : ass.testLevel === "Medium"
//                     ? "bg-yellow-500"
//                     : "bg-red-600"
//                 }`}
//               >
//                 {ass.testLevel}
//               </Badge>
//               <TestAlert
//                 onContinue={() => navigate(`/assessment-detail/${ass._id}`)}
//               >
//                 <Button
//                   disabled={role === "instructor"}
//                   className="bg-green-400 hover:bg-green-600"
//                 >
//                   Attempt
//                 </Button>
//               </TestAlert>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default QuestionCard;

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TestAlert from "./TestAlert";

const AssessmentCard = ({ assessment, role }) => {
  if (!assessment || !assessment.assessments) {
    return <div>No assessments available.</div>;
  }

  const navigate = useNavigate();
  const { assessments } = assessment;

  return (
    <div className="flex flex-row gap-5 w-max flex-wrap">
      {assessments?.map((ass) => {
        const now = new Date();
        const start = new Date(ass.startTime);
        const end = new Date(ass.endTime);
        const isTestActive = now >= start && now <= end;

        return (
          <Card key={ass._id} className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 pt-5 w-80">
            <div className="relative pl-4">
              <h1 className="hover:underline font-bold text-lg truncate">
                {ass.testTitle}
              </h1>
              <h1 className="font-medium text-sm">Course: {ass.course || "N/A"}</h1>
              <h1 className="font-medium text-sm">Test Type: {ass.testType || "N/A"}</h1>
            </div>

            <CardContent className="px-5 py-4 space-y-3">
              <div className="flex items-center justify-around gap-3">
                <div className="flex items-center gap-3 flex-row">
                  <span>Created By</span>
                  <h1 className="font-medium text-sm">{ass?.createdBy?.name}</h1>
                </div>
              </div>

              <div>
                <h4>Start Time</h4>
                <h4>{new Date(ass.startTime).toLocaleString()}</h4>
              </div>
              <div>
                <h4>End Time</h4>
                <h4>{new Date(ass.endTime).toLocaleString()}</h4>
              </div>

              <div className="text-lg font-bold flex flex-row gap-3 justify-around">
                <Badge
                  className={`text-white px-2 py-1 text-xs rounded-full ${
                    ass.testLevel === "Beginner"
                      ? "bg-green-500"
                      : ass.testLevel === "Medium"
                      ? "bg-yellow-500"
                      : "bg-red-600"
                  }`}
                >
                  {ass.testLevel}
                </Badge>

                <TestAlert
                  onContinue={() => navigate(`/assessment-detail/${ass._id}`)}
                  startTime={ass.startTime}
                  endTime={ass.endTime}
                  disabled={!isTestActive}
                >
                  <Button
                    disabled={role === "instructor"}
                    className="bg-green-400 hover:bg-green-600"
                  >
                    Attempt
                  </Button>
                </TestAlert>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AssessmentCard;

