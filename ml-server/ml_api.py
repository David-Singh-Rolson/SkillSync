# from flask import Flask, request, jsonify
# import joblib
# import json
# import numpy as np
# import os as os
# import pandas as pd

# app = Flask(__name__)

# # Load trained model
# model = joblib.load("recommendation_model.pkl")

# # Load topics list

# # BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# # with open(os.path.join(BASE_DIR, 'topics.json'), 'r') as f:
# #     available_topics=json.load(f)

# try:
#     BASE_DIR = os.path.dirname(os.path.abspath(__file__))
#     TOPIC_PATH = os.path.join(BASE_DIR, 'topics.json')

#     if not os.path.exists(TOPIC_PATH):
#         raise FileNotFoundError(f"topics.json not found at: {TOPIC_PATH}")

#     with open(TOPIC_PATH, 'r') as f:
#         available_topics = json.load(f)
#     print("✅ topics.json loaded successfully!")

# except Exception as e:
#     print("❌ Failed to load topics.json:", e)
#     available_topics = []


# # @app.route('/predict', methods=['POST'])
# # def predict():
# #     data = request.get_json()

# #     # Create feature vector dynamically
# #     features = []
# #     for topic in available_topics:
# #         features.append(data.get(topic, 0))  # if missing, assume 0

# #     features.append(0 if data.get("testType") == "Topic" else 1)
# #     features.append(data.get("avgPreviousPerformance", 0))
# #     features.append(data.get("avgQuestionDifficulty", 2))

# #     features = np.array(features).reshape(1, -1)

# #     prediction = model.predict(features)[0]

# #     return jsonify({"recommendedCourseId": prediction})

# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.get_json()

#     features = []
#     for topic in available_topics:
#         features.append(data.get(topic, 0))

#     features.append(0 if data.get("testType") == "Topic" else 1)
#     features.append(data.get("avgPreviousPerformance", 0))
#     features.append(data.get("avgQuestionDifficulty", 2))

#     # ✅ Build DataFrame with column names
#     input_df = pd.DataFrame([features], columns=available_topics + [
#         "testType", "avgPreviousPerformance", "avgQuestionDifficulty"
#     ])

#     # ✅ Predict probabilities
#     probabilities = model.predict_proba(input_df)[0]
#     class_indices = np.argsort(probabilities)[::-1]

#     recommendations = []
#     threshold = 0.3

#     for idx in class_indices:
#         if probabilities[idx] >= threshold:
#             recommendations.append({
#                 "courseId": model.classes_[idx],
#                 "confidence": float(probabilities[idx])
#             })

#     if not recommendations:
#         top_idx = class_indices[0]
#         recommendations.append({
#             "courseId": model.classes_[top_idx],
#             "confidence": float(probabilities[top_idx])
#         })

#     return jsonify({
#         "recommendedCourses": recommendations
#     })

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000)



from flask import Flask, request, jsonify
import joblib
import json
import numpy as np
import os
import pandas as pd  # ✅ Make sure pandas is imported

app = Flask(__name__)

# Load model
model = joblib.load("recommendation_model.pkl")

# Load topics
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(BASE_DIR, 'topics.json'), 'r') as f:
    available_topics = json.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    features = []
    for topic in available_topics:
        features.append(data.get(topic, 0))

    features.append(0 if data.get("testType") == "Topic" else 1)
    features.append(data.get("avgPreviousPerformance", 0))
    features.append(data.get("avgQuestionDifficulty", 2))

    # ✅ NEW: build input dataframe with feature names
    input_df = pd.DataFrame([features], columns=available_topics + [
        "testType", "avgPreviousPerformance", "avgQuestionDifficulty"
    ])

    # ✅ NEW: probability prediction with feature names
    probas = model.predict_proba(input_df)[0]
    class_indices = np.argsort(probas)[::-1]

    recommendations = []
    threshold = 0.3

    for idx in class_indices:
        if probas[idx] >= threshold:
            recommendations.append({
                "courseId": model.classes_[idx],
                "confidence": float(probas[idx])
            })

    if not recommendations:
        top_idx = class_indices[0]
        recommendations.append({
            "courseId": model.classes_[top_idx],
            "confidence": float(probas[top_idx])
        })

    return jsonify({
        "recommendedCourses": recommendations
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)