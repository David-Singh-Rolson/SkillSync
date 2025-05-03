
from flask import Flask, request, jsonify
import joblib
import json
import numpy as np
import os
import pandas as pd  

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
    # ✅ Step: Add fallback if no confident course found

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