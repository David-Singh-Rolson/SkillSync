import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice"; 
import uiReducer from "../features/uiSlice"
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseProgressApi } from "@/features/api/courseProgressApi";
import { assessmentApi } from "@/features/api/assessmentApi";
import { questionApi } from "@/features/api/questionApi";
import { testAttemptApi } from "@/features/api/testAttemptApi";
import {recommendationApi} from "@/features/api/recommendationApi"
import { mcqApi } from "@/features/api/mcqBuilderApi";
import { performanceApi } from "@/features/api/performanceApi";
import { otpApi } from "@/features/api/otpApi";

import { forumApi } from "@/features/forums/api/forumApi";
import { commentApi } from "@/features/forums/api/commentApi";

const rootRedcuer = combineReducers({
    [authApi.reducerPath]:authApi.reducer,
    [courseApi.reducerPath]:courseApi.reducer,
    [purchaseApi.reducerPath]:purchaseApi.reducer,
    [courseProgressApi.reducerPath]:courseProgressApi.reducer,
    [assessmentApi.reducerPath]:assessmentApi.reducer,
    [questionApi.reducerPath]:questionApi.reducer,
    [testAttemptApi.reducerPath]:testAttemptApi.reducer,
    [recommendationApi.reducerPath]:recommendationApi.reducer,
    [mcqApi.reducerPath]:mcqApi.reducer,
    [performanceApi.reducerPath]:performanceApi.reducer,
    [otpApi.reducerPath]:otpApi.reducer,
    [forumApi.reducerPath]:forumApi.reducer,
    [commentApi.reducerPath]:commentApi.reducer,
    auth:authReducer, 
    ui:uiReducer
});
export default rootRedcuer;