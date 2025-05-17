//New post or Question form
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const NewPost = () => {
  const maxDescriptionLength = 6000;
  const navigate = useNavigate();
  const [input, setInput] = useState({
    forumTitle: "",
    forumDescription: "",
    relevantTags: "",
    participation: [],
  });
  const charCount = () => {};
  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  const selectParticipation = (value) => {
    setInput({ ...input, testLevel: value });
  };
  const handleCreate = () => {
    // submit api call
    navigate("/forum");
  };
  const handleCancel = () => {
    navigate("/forum");
  };
  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white tracking-wide">
            Create a New Forum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mt-5 ">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="forumTitle"
                value={input.forumTitle}
                onChange={changeEventHandler}
                placeholder="Enter your forum title"
                className="h-12 text-base p-3"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                name="forumDescription"
                value={input.forumDescription}
                onChange={changeEventHandler}
                placeholder="Enter your forum description"
                maxLength={6000}
                rows={6}
                className="resize-none py-3"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {input.forumDescription.length}/{maxDescriptionLength}{" "}
                characters
              </p>
            </div>
            <div>
              <Label>Relevant Tags</Label>
              <Input
                type="text"
                name="relevantTags"
                value={input.relevantTags}
                onChange={changeEventHandler}
                placeholder="Add tags related to this forum"
                className="h-12 text-base p-3"
              />
            </div>
            <div>
  <Label>Select Participants</Label>
  <div className="flex gap-4 mt-2">
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        name="student"
        checked={input.participation.includes("student")}
        onChange={(e) => {
          const updated = e.target.checked
            ? [...input.participation, "student"]
            : input.participation.filter((p) => p !== "student");
          setInput((prev) => ({ ...prev, participation: updated }));
        }}
        className="h-4 w-4"
      />
      <span>Student</span>
    </label>
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        name="instructor"
        checked={input.participation.includes("instructor")}
        onChange={(e) => {
          const updated = e.target.checked
            ? [...input.participation, "instructor"]
            : input.participation.filter((p) => p !== "instructor");
          setInput((prev) => ({ ...prev, participation: updated }));
        }}
        className="h-4 w-4"
      />
      <span>Instructor</span>
    </label>
  </div>
</div>

          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleCreate}>Create Forum</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewPost;
