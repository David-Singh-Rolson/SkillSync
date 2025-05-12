const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const MCQ_API=`${BASE_API_URL}/api/v1`


export const mcqApi = createApi({
  reducerPath: 'mcqApi',
  baseQuery: fetchBaseQuery({ baseUrl: MCQ_API,credentials: "include", }),
  
  endpoints: (builder) => ({
    generateMCQs: builder.mutation({
      query: (obj) => ({
        url: "/mcq-builder",
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body:{...obj}
      }),
    }),
  }),
});

export const { useGenerateMCQsMutation } = mcqApi;
