
import axios from "axios";

export const getMLRecommendedCourse = async (features) => {
  try {
    // const res = await axios.post("http://localhost:5000/predict", features);
    const res = await axios.post("http://127.0.0.1:5000/predict", features);

    
    // New structure expects recommendedCourses as array
    if (res.data && Array.isArray(res.data.recommendedCourses)) {
      return res.data.recommendedCourses; // array of courseId + confidence
    } else {
      return []; // fallback
    }

  } catch (error) {
    console.error("ML API Error:", error.message);
    return [];
  }
};