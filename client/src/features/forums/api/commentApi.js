const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COMMENT_API = `${BASE_API_URL}/api/v1/forum/comment`;

export const commentApi=createApi({
    reducerPath:"commentApi",
    baseQuery:fetchBaseQuery({
        baseUrl:COMMENT_API,
        credentials:"include",
    }),
    endpoints:(builder)=>({
        createComment:builder.mutation({
            query:(obj)=>({
                url:"/create",
                method:"POST",
                body:{...obj},
            }),
        }),
        // getCommentsByPostId:builder.query({
        //     query:(postId)=>({
        //         url:`/get/all/${postId}`,
        //         method:"GET"
        //     }),
        // }),
    }),
})

export const {useCreateCommentMutation,useGetCommentsByPostIdQuery}=commentApi
