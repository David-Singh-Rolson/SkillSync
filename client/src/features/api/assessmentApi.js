

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ASSESSMENT_API = "http://localhost:8080/api/v1/assessment";

export const assessmentApi = createApi({
  reducerPath: "assessmentApi",
  tagTypes: ["Refetch-Creator-Assessment"],
  baseQuery: fetchBaseQuery({
    baseUrl: ASSESSMENT_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createAssessment: builder.mutation({
      query: (obj) => ({
        url: "/",
        method: "POST",
        body: { ...obj },
      }),
      invalidatesTags: ["Refetch-Creator-Assessment"],
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
    addQuestion: builder.mutation({
      query: ({ questionId, assessmentId }) => ({
        url: `/${assessmentId}`,
        method: "PUT",
        body: { questionId },
      }),
      invalidatesTags: (result, error, { assessmentId }) => [
        { type: "Refetch-Creator-Assessment", id: assessmentId },
      ],
    }),
    getQuestionByAssessmentId: builder.query({
      query: (assessmentId) => ({
        url: `/${assessmentId}/questions`,
        method: "GET",
      }),
      providesTags: (result, error, assessmentId) => [
        { type: "Refetch-Creator-Assessment", id: assessmentId },
      ],
    }),
    publishAssessment: builder.mutation({
      query: ({ assessmentId, query }) => ({
        url: `/${assessmentId}?publish=${query}`,
        method: "PATCH",
      }),
      // invalidatesTags: (result, error, { assessmentId }) => [
      //   { type: "Refetch-Creator-Assessment", id: assessmentId },
      // ],
      invalidatesTags: (result, error, { assessmentId }) => [
        { type: "Refetch-Creator-Assessment", id: assessmentId },
        { type: "PublishedAssessments", id: assessmentId }, // Invalidate the published assessments tag
      ],
    }),
    getAssessmentById: builder.query({
      query: (assessmentId) => ({
        url: `/${assessmentId}`,
        method: "GET",
      }),
    }),
    getAllPublishedAssessments: builder.query({
      query: () => ({
        url: "/published/assessments",
        method: "GET",
      }),
      providesTags: ["PublishedAssessments"],
    }),
  }),
});

export const {
  useCreateAssessmentMutation,
  useGetCreatorAssessmentQuery,
  useAddQuestionMutation,
  useGetQuestionByAssessmentIdQuery,
  usePublishAssessmentMutation,
  useGetAssessmentByIdQuery,
  useGetAllPublishedAssessmentsQuery,
} = assessmentApi;
