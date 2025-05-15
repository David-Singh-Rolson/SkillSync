const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const OTP_API = `${BASE_API_URL}/api/v1/otp`;

export const otpApi=createApi({
    reducerPath:"otpApi",
    baseQuery:fetchBaseQuery({
        baseUrl:OTP_API,
        credentials:"include"
    }),
    endpoints:(builder)=>({
        sendOtp:builder.mutation({
            query:({email})=>({
                url:"/send",
                method:"POST",
                body:{email}
            }),
        }),
        verifyOtp:builder.mutation({
            query:({email,otp})=>({
                url:"/verify",
                method:"POST",
                body:{email,otp}
            }),
        }),
    }),
});

export const {useSendOtpMutation,useVerifyOtpMutation}=otpApi;