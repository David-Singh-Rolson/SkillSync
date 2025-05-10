import { configureStore } from "@reduxjs/toolkit";
import rootRedcuer from "./rootRedcuer";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseProgressApi } from "@/features/api/courseProgressApi";
import { assessmentApi } from "@/features/api/assessmentApi";
import { questionApi } from "@/features/api/questionApi";
import { testAttemptApi } from "@/features/api/testAttemptApi";
import { recommendationApi } from "@/features/api/recommendationApi";
import { mcqApi } from "@/features/api/mcqBuilderApi";
import { performanceApi } from "@/features/api/performanceApi";
export const appStore = configureStore({
  reducer: rootRedcuer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(
      authApi.middleware,
      courseApi.middleware,
      purchaseApi.middleware,
      courseProgressApi.middleware,
      assessmentApi.middleware,
      questionApi.middleware,
      testAttemptApi.middleware,
      recommendationApi.middleware,
      mcqApi.middleware,
      performanceApi.middleware
    ),
});

const initializeApp = async () => {
  await appStore.dispatch(
    authApi.endpoints.loadUser.initiate({}, { forceRefetch: true })
  );
};
initializeApp();
