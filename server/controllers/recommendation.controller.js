import { TestAttempt } from "../models/testAttempt.model.js";
import { getAvailableTopics } from "../utils/topics.js";
import { getMLRecommendedCourse } from "../utils/mlService.js";

export const getUserRecommendations = async (req, res) => {
  try {
    const userId = req.id;
console.log("userId",userId);

    const attempts = await TestAttempt.find({ student: userId, status: "Submitted" });

    if (!attempts || attempts.length === 0) {
      return res.status(200).json({ recommendedCourses: [] });
    }

    const topics = getAvailableTopics();
    const topicSum = {};
    let totalPerf = 0, totalDiff = 0;

    topics.forEach(topic => topicSum[topic] = 0);

    attempts.forEach(attempt => {
      topics.forEach(topic => {
        const val = attempt.topicWisePerformance?.get(topic) || 0;
        topicSum[topic] += val;
      });
      totalPerf += attempt.avgPreviousPerformance || 0;
      totalDiff += attempt.avgQuestionDifficulty || 0;
    });

    const feature = {};
    const count = attempts.length;
    topics.forEach(topic => {
      feature[topic] = topicSum[topic] / count;
    });

    feature.avgPreviousPerformance = totalPerf / count;
    feature.avgQuestionDifficulty = totalDiff / count;
    feature.testType = "Mixed";

    const recommendedCourses = await getMLRecommendedCourse(feature);

    return res.status(200).json({ recommendedCourses });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate personalized recommendation" });
  }
};