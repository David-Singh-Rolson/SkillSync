from flask import Flask, request, jsonify
import joblib
import json
import numpy as np

app = Flask(__name__)

# Load trained model
model = joblib.load("recommendation_model.pkl")

# Load topics list
with open('topics.json', 'r') as f:
    available_topics = json.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # Create feature vector dynamically
    features = []
    for topic in available_topics:
        features.append(data.get(topic, 0))  # if missing, assume 0

    features.append(0 if data.get("testType") == "Topic" else 1)
    features.append(data.get("avgPreviousPerformance", 0))
    features.append(data.get("avgQuestionDifficulty", 2))

    features = np.array(features).reshape(1, -1)

    prediction = model.predict(features)[0]

    return jsonify({"recommendedCourseId": prediction})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
