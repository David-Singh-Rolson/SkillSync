
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PERFORMANCE_API = `${BASE_API_URL}/api/v1`;

export const performanceApi=createApi({
    reducerPath:"performanceApi",
    baseQuery:fetchBaseQuery({
        baseUrl:PERFORMANCE_API,
        credentials:"include",
    }),
    endpoints:(builder)=>({
        getLatestTestResult:builder.mutation({
            query:({userId})=>({
                url:"/",
                method:"POST",
                body:{userId}
            }),
        }),
    }),
});




export const {useGetLatestTestResultMutation}=performanceApi;