import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { Edit, Loader2 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetCreatorAssessmentQuery } from "@/features/api/assessmentApi";
import { format } from "date-fns";
export const TestTable = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetCreatorAssessmentQuery();
  if (isLoading) {
    return <Loader2 />;
  }
  console.log(data);

  return (
    <div>
      <Button onClick={() => navigate(`create-test`)}>Create a new test</Button>
      <Table>
        <TableCaption>A list of your recent test.</TableCaption>
        <TableHeader>
          <TableRow>
            {/* <TableHead className="w-[100px]">Price</TableHead> */}
            <TableHead>Status</TableHead>
            <TableHead>Assessment Title</TableHead>
            <TableHead className="w-[100px]">Assessment End Time</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.tests.map((test) => (
            <TableRow key={test._id}>
              <TableCell>
                {/* {" "} */}
                <Badge className={test.isPublished ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
  {test.isPublished ? "Published" : "Draft"}
</Badge>{" "}

              </TableCell>
              <TableCell>{test.testTitle}</TableCell>
              {/* <TableCell>{test.endTime}</TableCell> */}
              <TableCell>
                {test.endTime
                  ? format(new Date(test.endTime), "PPP, HH:mm")
                  : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`${test._id}`)}
                >
                  <Edit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
