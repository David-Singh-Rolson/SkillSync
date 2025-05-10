import {Course} from "../models/course.model.js"

// 1️⃣ Helper function: Load all courses from DB
const fetchAllCourses = async () => {
  const allCourses = await Course.find({}, "_id courseTitle category");
  return allCourses;
};

// 2️⃣ Rule-Based Function
export const getRuleBasedRecommendation = async (features) => {
  const { avgPreviousPerformance, avgQuestionDifficulty, testType } = features;

  // 🧠 Step 1: Fetch all courses
  const allCourses = await fetchAllCourses();

  if (!allCourses || allCourses.length === 0) {
    console.warn("⚠ No courses found in DB for rule-based fallback.");
    return [];
  }

  // 🧪 Step 2: Define logic based on testType, performance etc.

  let recommendedCourses = [];

  // 🔹 Case 1: Low Performance + High Difficulty → Recommend Beginner courses
  if (avgPreviousPerformance < 40 && avgQuestionDifficulty >= 2.2) {
    recommendedCourses = allCourses.filter(course =>
      course.courseTitle.toLowerCase().includes("basic") ||
      course.category.toLowerCase().includes("beginner")
    );
  }

  // 🔹 Case 2: Medium Performance → Recommend Medium courses
  else if (avgPreviousPerformance >= 40 && avgPreviousPerformance < 70) {
    recommendedCourses = allCourses.filter(course =>
      course.category.toLowerCase().includes("medium")
    );
  }

  // 🔹 Case 3: High Performance → Recommend Advanced courses
  else if (avgPreviousPerformance >= 70) {
    recommendedCourses = allCourses.filter(course =>
      course.category.toLowerCase().includes("advance")
    );
  }

  // 🔹 Fallback (If above filters return nothing)
  if (recommendedCourses.length === 0) {
    // Pick random 3
    recommendedCourses = allCourses.sort(() => 0.5 - Math.random()).slice(0, 3);
  }

  // ✅ Return in format similar to ML API
  return recommendedCourses.map(course => ({
    courseId: course._id.toString(),
    confidence: 0.2,
    ruleBased: true
  }));
};