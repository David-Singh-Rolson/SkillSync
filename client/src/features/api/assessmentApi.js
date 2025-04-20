// // import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const ASSESSMENT_API="http://localhost:8080/api/v1/assessment";

// export const assessmentApi=createApi({
//     reducerPath:"assessmentApi",
//     baseQuery:fetchBaseQuery({
//         baseUrl:ASSESSMENT_API,
//         credentials:"include"
//     }),
//     endpoints:(builder) =>({
//         createAssessment:builder.mutation({
//             query:({testTitle,testType,timeLimit,...rest}),
//             url:"/",
//             method:"POST",
//             body:{testTitle,testType,timeLimit}
//         })
//     })
// })

// export const {useCreateAssessmentMutation}=assessmentApi;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const ASSESSMENT_API = "http://localhost:8080/api/v1/assessment";

export const assessmentApi = createApi({
  reducerPath: "assessmentApi",
  tagTypes:["Refetch-Creator-Assessment"],
  baseQuery: fetchBaseQuery({
    baseUrl: ASSESSMENT_API,
    credentials: "include"
  }),
  endpoints: (builder) => ({
    createAssessment: builder.mutation({
      query: (obj) => ({
        url: "/",
        method: "POST",
        body: { ...obj }
      }),
      invalidatesTags :["Refetch-Creator-Assessment"]
    }),
    getCreatorAssessment: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.tests?.map((test) => ({
          type: "Refetch-Creator-Assessment",
          id: test._id,
        })) ?? [{ type: "Refetch-Creator-Assessment" }],
    
    }),
    addQuestion :builder.mutation({
      query:({questionId,assessmentId})=>({
        url:`/${assessmentId}`,
        method:"PUT",
        body:{questionId}
      }),
      invalidatesTags: (result, error, { assessmentId }) => [
        { type: "Refetch-Creator-Assessment", id: assessmentId }
      ]
    }),
    getQuestionByAssessmentId:builder.query({
      query:(assessmentId)=>({
        url: `/${assessmentId}/questions`,
        method:"GET",
      }),
      providesTags: (result, error, assessmentId) => [
        { type: "Refetch-Creator-Assessment", id: assessmentId }
      ],
    }),
    publishAssessment: builder.mutation({
      query:({assessmentId,query})=>({
        url:`/${assessmentId}?publish=${query}`,
        method:"PATCH",
      }),
      invalidatesTags: (result, error, { assessmentId }) => [
        { type: "Refetch-Creator-Assessment", id: assessmentId },
      ],
    }),
    getAssessmentById:builder.query({
      query:(assessmentId)=>({
        url: `/${assessmentId}`,
        method:"GET",
      }),
    }),
  }),
});

export const { useCreateAssessmentMutation,useGetCreatorAssessmentQuery ,useAddQuestionMutation,useGetQuestionByAssessmentIdQuery,usePublishAssessmentMutation,useGetAssessmentByIdQuery} = assessmentApi;
