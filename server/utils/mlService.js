import axios from "axios";

export const getMLRecommendedCourse = async (features) => {
  try {
    const res = await axios.post("http://localhost:5000/predict", features);
    return res.data.recommendedCourseId;
  } catch (error) {
    console.error("ML API Error:", error.message);
    return null;
  }
};
