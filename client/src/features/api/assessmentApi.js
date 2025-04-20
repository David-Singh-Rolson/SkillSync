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
      providesTags :["Refetch-Creator-Assessment"]
    }),
  })
});

export const { useCreateAssessmentMutation,useGetCreatorAssessmentQuery } = assessmentApi;
