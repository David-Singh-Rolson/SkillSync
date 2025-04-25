import { createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { assessmentApi } from "./assessmentApi";

const TEST_ATTEMPT_API = "http://localhost:8080/api/v1/test/attempt";

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
            query:({ attemptId, responses })=>({
                url:`/submit/${attemptId}`,
                method:"POST",
                body:{attemptId,responses}
            })
        })
    }),
});

export  const {useFetchTestQuestionsMutation,useSubmitTestAttemptMutation}=testAttemptApi