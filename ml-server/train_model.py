import pandas as pd
import numpy as np
import joblib
import json
from pymongo import MongoClient
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# MongoDB connection
client = MongoClient("mongodb+srv://davidsinghrolson:l0kjL6nobVBEGKkB@cluster0.ruleu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["test"]  #  database name
collection = db.testattempts

# Fetch TestAttempt data
attempts = list(collection.find({
    "status": "Submitted",
    "labelCourseId": {"$ne": None}
}))

print(f"Fetched {len(attempts)} records.")

# Detect all topics dynamically
available_topics = set()
for attempt in attempts:
    perf = attempt.get("topicWisePerformance", {})
    available_topics.update(perf.keys())

available_topics = sorted(list(available_topics))  # Always sorted

print(f"Detected Topics: {available_topics}")

# Save topics list for future use
with open('topics.json', 'w') as f:
    json.dump(available_topics, f)

# Feature extraction
def process(attempt):
    perf = attempt.get("topicWisePerformance", {})
    features = {topic: perf.get(topic, 0) for topic in available_topics}
    features["testType"] = 0 if attempt.get("testType") == "Topic" else 1
    features["avgPreviousPerformance"] = attempt.get("avgPreviousPerformance", 0)
    features["avgQuestionDifficulty"] = attempt.get("avgQuestionDifficulty", 2)
    features["labelCourseId"] = str(attempt["labelCourseId"])
    return features

# Create DataFrame
df = pd.DataFrame([process(a) for a in attempts])

# Features and labels
X = df.drop(columns=["labelCourseId"])
y = df["labelCourseId"]

# Split into train/test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Accuracy
accuracy = model.score(X_test, y_test)
print(f"✅ Model Accuracy: {accuracy * 100:.2f}%")

# Save trained model
joblib.dump(model, "recommendation_model.pkl")

print("✅ Model trained and saved successfully!")
