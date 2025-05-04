import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const MCQ_API="http://localhost:8080/api/v1"


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
