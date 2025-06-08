const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const FORUM_API = `${BASE_API_URL}/api/v1/forum`;

export const forumApi = createApi({
  reducerPath: "forumApi",
  baseQuery: fetchBaseQuery({
    baseUrl: FORUM_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createForum: builder.mutation({
      query: (obj ) => ({
        url: "/create",
        method: "POST",
        body: { ...obj },
      }),
    }),
    getAllPosts: builder.query({
      query: () => ({
        url: "/get/all/posts",
        method: "GET",
      }),
    }),

    getPostDetailsById:builder.query({
      query:(postId)=>({
        url:`/post/details/${postId}`,
        method:"GET",
      }),
    }),
  }),
});

export const { useCreateForumMutation, useGetAllPostsQuery ,useGetPostDetailsByIdQuery} = forumApi;
