//New post or Question form
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addPostToTop } from "@/features/forumSlice";
import { useCreateForumMutation, useGetAllPostsQuery } from "../api/forumApi";

const NewPost = () => {
  const role = useSelector((state) => state.auth.user?.role);
  const user = useSelector((state) => state.auth.user?._id);
  const dispatch = useDispatch();

  const [
    createForum,
    {
      data: createdForumData,
      isSuccess: forumCreatedSuccess,
      isError: forumCreationError,
      isLoading: creatingForum,
    },
  ] = useCreateForumMutation();
  const {
    data: postData,
    refetch: refetchPosts,
    isSuccess: fetchedPosts,
    isError: fetchPostError,
    isLoading: fetchingPosts,
  } = useGetAllPostsQuery();
  const maxDescriptionLength = 6000;
  const navigate = useNavigate();
  const [input, setInput] = useState({
    postTitle: "",
    postContent: "",
    relevantTags: "",
    participants: [],
  });
  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  const selectParticipation = (value) => {
    setInput({ ...input, testLevel: value });
  };
  const handleCreate = async () => {
    // submit api call
    const uniqueParticipants = new Set(input.participants);
    uniqueParticipants.add("admin");
    const forumData = {
      postTitle: input.postTitle,
      postContent: input.postContent,
      tags: input.relevantTags
        ?.split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
      participants: [...uniqueParticipants],
      role: role,
      user:user
    };
    console.log("forumdata", forumData);

    const response = await createForum(forumData).unwrap();
    dispatch(addPostToTop(response.post));
    refetchPosts()
    toast.success("Forum created successfully!");
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
                name="postTitle"
                value={input.postTitle}
                onChange={changeEventHandler}
                placeholder="Enter your forum title"
                className="h-12 text-base p-3"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                name="postContent"
                value={input.postContent}
                onChange={changeEventHandler}
                placeholder="Enter your forum description"
                maxLength={6000}
                rows={6}
                className="resize-none py-3"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {input.postContent.length}/{maxDescriptionLength} characters
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
                    checked={input.participants.includes("student")}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...input.participants, "student"]
                        : input.participants.filter((p) => p !== "student");
                      setInput((prev) => ({ ...prev, participants: updated }));
                    }}
                    className="h-4 w-4"
                  />
                  <span>Student</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="instructor"
                    checked={input.participants.includes("instructor")}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...input.participants, "instructor"]
                        : input.participants.filter((p) => p !== "instructor");
                      setInput((prev) => ({ ...prev, participants: updated }));
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
