const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

import { createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { assessmentApi } from "./assessmentApi";

const TEST_ATTEMPT_API = `${BASE_API_URL}/api/v1/test/attempt`;

export const testAttemptApi=createApi({
    reducerPath:"testAttemptApi",
    baseQuery:fetchBaseQuery({
        baseUrl:TEST_ATTEMPT_API,
        credentials:"include",
    }),
    endpoints:(builder)=>({
        fetchTestQuestions:builder.mutation({
            query:({assessmentId,userId,role})=>({
                url:"/",
                method:"POST",
                body:{assessmentId,userId,role},
            }),
        }),
        submitTestAttempt:builder.mutation({
            query:({ attemptId, responses,testType,testLevel })=>({
                url:`/submit/${attemptId}`,
                method:"POST",
                body:{attemptId,responses,testType,testLevel}
            })
        })
    }),
});

export  const {useFetchTestQuestionsMutation,useSubmitTestAttemptMutation}=testAttemptApi