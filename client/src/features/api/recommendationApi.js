const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";// api khud se likho

const RECOMMENDATION_API = `${BASE_API_URL}/api/v1`;

export const recommendationApi = createApi({
  reducerPath: "recommendationApi",
  tagTypes: ["Recommendation"],
  baseQuery: fetchBaseQuery({
    baseUrl: RECOMMENDATION_API,
    credentials: "include", // if using cookies
  }),
  endpoints: (builder) => ({
    getUserRecommendations: builder.query({
      query: () => ({
        url: "/recommendation/user",
        method: "GET",
      }),
      providesTags: ["Recommendation"],
    }),

    // Future endpoints:
    getRecommendationMetrics: builder.query({
      query: () => ({
        url: "/recommendation/metrics",
        method: "GET",
      }),
    }),

    getCourseWiseStats: builder.query({
      query: (courseId) => ({
        url: `/recommendation/course/${courseId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetUserRecommendationsQuery,
  useGetRecommendationMetricsQuery,
  useGetCourseWiseStatsQuery,
} = recommendationApi;