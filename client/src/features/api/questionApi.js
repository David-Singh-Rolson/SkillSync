import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const QUESTION_API = "http://localhost:8080/api/v1/question";
export const questionApi=createApi({
    reducerPath:"questionApi",
    baseQuery:fetchBaseQuery({
        baseUrl:QUESTION_API,
        credentials:"include"
    }),
    endpoints:(builder)=>({
        createNewQuestion:builder.mutation({
            query:(obj) =>({
                url:"/",
                method:"POST",
                body:{...obj}
            }),
        })
    })
})

export const {useCreateNewQuestionMutation}=questionApi