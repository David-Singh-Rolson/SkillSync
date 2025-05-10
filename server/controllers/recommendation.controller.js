// import { TestAttempt } from "../models/testAttempt.model.js";
// import { getAvailableTopics } from "../utils/topics.js";
// import { getMLRecommendedCourse } from "../utils/mlService.js";

// export const getUserRecommendations = async (req, res) => {
//   try {
//     const userId = req.id;
// console.log("userId",userId);

//     const attempts = await TestAttempt.find({ student: userId, status: "Submitted" });

//     if (!attempts || attempts.length === 0) {
//       return res.status(200).json({ recommendedCourses: [] });
//     }

//     const topics = getAvailableTopics();
//     const topicSum = {};
//     let totalPerf = 0, totalDiff = 0;

//     topics.forEach(topic => topicSum[topic] = 0);

//     attempts.forEach(attempt => {
//       topics.forEach(topic => {
//         const val = attempt.topicWisePerformance?.get(topic) || 0;
//         topicSum[topic] += val;
//       });
//       totalPerf += attempt.avgPreviousPerformance || 0;
//       totalDiff += attempt.avgQuestionDifficulty || 0;
//     });

//     const feature = {};
//     const count = attempts.length;
//     topics.forEach(topic => {
//       feature[topic] = topicSum[topic] / count;
//     });

//     feature.avgPreviousPerformance = totalPerf / count;
//     feature.avgQuestionDifficulty = totalDiff / count;
//     feature.testType = "Mixed";

//     const recommendedCourses = await getMLRecommendedCourse(feature);

//     return res.status(200).json({ recommendedCourses });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to generate personalized recommendation" });
//   }
// };


import { TestAttempt } from "../models/testAttempt.model.js";
import { getAvailableTopics } from "../utils/topics.js";
import { getMLRecommendedCourse } from "../utils/mlService.js";
import { getRuleBasedRecommendation } from "../utils/ruleBased.js";
import { Course } from "../models/course.model.js";

export const getUserRecommendations = async (req, res) => {
  try {
    const userId = req.id;
    console.log("👤 userId:", userId);

    // 1️⃣ Fetch All Submitted Attempts of that User
    const attempts = await TestAttempt.find({
      student: userId,
      status: "Submitted"
    });

    if (!attempts || attempts.length === 0) {
      return res.status(200).json({ recommendedCourses: [] });
    }

    // 2️⃣ Load Available Topics
    const topics = getAvailableTopics();
    const topicSum = {};
    let totalPerf = 0, totalDiff = 0;

    topics.forEach(topic => topicSum[topic] = 0);

    // 3️⃣ Loop through all attempts to calculate feature averages
    attempts.forEach(attempt => {
      topics.forEach(topic => {
        const value = attempt.topicWisePerformance?.[topic] || 0;
        topicSum[topic] += value;
      });
      totalPerf += attempt.avgPreviousPerformance || 0;
      totalDiff += attempt.avgQuestionDifficulty || 0;
    });

    const count = attempts.length;
    const features = {};
    topics.forEach(topic => {
      features[topic] = +(topicSum[topic] / count).toFixed(2);
    });
    features.avgPreviousPerformance = +(totalPerf / count).toFixed(2);
    features.avgQuestionDifficulty = +(totalDiff / count).toFixed(2);
    features.testType = "Mixed"; // default testType for this view

    console.log("📊 Features sent to ML:", features);

    // 4️⃣ Call ML API
    const mlRecommendations = await getMLRecommendedCourse(features);

    // if (mlRecommendations?.length > 0 && mlRecommendations[0].confidence >= 0.3) {
    //   return res.status(200).json({ recommendedCourses: mlRecommendations });
    // }

    // Extract IDs
const recommendedIds = mlRecommendations
?.filter(rec => rec.confidence >= 0.3)
.map(rec => rec.courseId); // assuming 'courseId' field exists

if (recommendedIds?.length > 0) {
const fullCourses = await Course.find({
  _id: { $in: recommendedIds },
  isPublished:true
}).populate({path:"creator", select:"name photoUrl"});

return res.status(200).json({ recommendedCourses: fullCourses });
}

    // 5️⃣ If ML returns low confidence → fallback to rule-based
    const fallbackRecommendations = await getRuleBasedRecommendation(features);
    // return res.status(200).json({
    //   recommendedCourses: fallbackCourses,
    //   fallback: true
    // });
    const fallbackCourseIds = fallbackRecommendations.map(rec => rec.courseId);
    
// const fallbackIds = fallbackRecommendations.map(rec => rec.courseId); // or similar
const fallbackCourses = await Course.find({
  _id: { $in: fallbackCourseIds },
  isPublished:true
}).populate({path:"creator", select:"name photoUrl"});

return res.status(200).json({
  recommendedCourses: fallbackCourses,
  fallback: true
});

  } catch (err) {
    console.error("❌ Error in getUserRecommendations:", err);
    res.status(500).json({
      message: "Failed to generate personalized recommendation"
    });
  }
};