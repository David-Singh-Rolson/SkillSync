

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PERFORMANCE_API = "http://localhost:8080/api/v1";

export const performanceApi=createApi({
    reducerPath:"performanceApi",
    baseQuery:fetchBaseQuery({
        baseUrl:PERFORMANCE_API,
        credentials:"include",
    }),
    endpoints:(builder)=>({
        
    })
})