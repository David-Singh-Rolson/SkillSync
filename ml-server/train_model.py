# import pandas as pd
# import numpy as np
# import joblib
# import json
# from pymongo import MongoClient
# from sklearn.model_selection import train_test_split
# from sklearn.ensemble import RandomForestClassifier

# # MongoDB connection
# client = MongoClient("mongodb+srv://davidsinghrolson:l0kjL6nobVBEGKkB@cluster0.ruleu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
# db = client["test"]  #  database name
# collection = db.testattempts

# # Fetch TestAttempt data
# attempts = list(collection.find({
#     "status": "Submitted",
#     "labelCourseId": {"$ne": None}
# }))

# print(f"Fetched {len(attempts)} records.")

# # Detect all topics dynamically
# available_topics = set()
# for attempt in attempts:
#     perf = attempt.get("topicWisePerformance", {})
#     available_topics.update(perf.keys())

# available_topics = sorted(list(available_topics))  # Always sorted

# print(f"Detected Topics: {available_topics}")

# # Save topics list for future use
# with open('topics.json', 'w') as f:
#     json.dump(available_topics, f)

# # Feature extraction
# def process(attempt):
#     perf = attempt.get("topicWisePerformance", {})
#     features = {topic: perf.get(topic, 0) for topic in available_topics}
#     features["testType"] = 0 if attempt.get("testType") == "Topic" else 1
#     features["avgPreviousPerformance"] = attempt.get("avgPreviousPerformance", 0)
#     features["avgQuestionDifficulty"] = attempt.get("avgQuestionDifficulty", 2)
#     features["labelCourseId"] = str(attempt["labelCourseId"])
#     return features

# # Create DataFrame
# df = pd.DataFrame([process(a) for a in attempts])

# # Features and labels
# X = df.drop(columns=["labelCourseId"])
# y = df["labelCourseId"]

# # Split into train/test
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # Train model
# model = RandomForestClassifier()
# model.fit(X_train, y_train)

# # Accuracy
# accuracy = model.score(X_test, y_test)
# print(f"✅ Model Accuracy: {accuracy * 100:.2f}%")

# # Save trained model
# joblib.dump(model, "recommendation_model.pkl")

# print("✅ Model trained and saved successfully!")

import pandas as pd
import numpy as np
import joblib
import json
from pymongo import MongoClient
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from collections import Counter
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import classification_report

# 🔗 MongoDB Connection
client = MongoClient("mongodb+srv://davidsinghrolson:l0kjL6nobVBEGKkB@cluster0.ruleu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["test"]
collection = db.testattempts

# 📥 Fetch Records
attempts = list(collection.find({
    "status": "Submitted",
    "labelCourseId": {"$ne": None}
}))
print(f"Fetched ✅ {len(attempts)} records.")

# 🧠 Detect Topics
available_topics = set()
for attempt in attempts:
    perf = attempt.get("topicWisePerformance", {})
    available_topics.update(perf.keys())

available_topics = sorted(list(available_topics))
print(f"Detected Topics: {available_topics}")

# 💾 Save topics
with open('topics.json', 'w') as f:
    json.dump(available_topics, f)
print("✅ topics.json saved")

# 🧪 Feature Engineering
def process(attempt):
    perf = attempt.get("topicWisePerformance", {})
    features = {topic: perf.get(topic, 0) for topic in available_topics}
    features["testType"] = 0 if attempt.get("testType") == "Topic" else 1
    features["avgPreviousPerformance"] = float(attempt.get("avgPreviousPerformance", 0))
    features["avgQuestionDifficulty"] = float(attempt.get("avgQuestionDifficulty", 2))
    features["labelCourseId"] = str(attempt["labelCourseId"])
    return features

df = pd.DataFrame([process(a) for a in attempts])
print("✅ DataFrame created.")

# 📊 Class Distribution
label_counts = df["labelCourseId"].value_counts()
print("Course Distribution (label counts):")
for label, count in label_counts.items():
    print(f"→ {label}: {count} records")

# ❌ Remove classes with < 10 samples
min_required = 10
valid_labels = label_counts[label_counts >= min_required].index
df = df[df["labelCourseId"].isin(valid_labels)].reset_index(drop=True)
print(f"✅ Remaining samples after filtering rare courses: {len(df)}")

# 💾 Save courses
with open('courses.json', 'w') as f:
    json.dump(df["labelCourseId"].unique().tolist(), f)
print("✅ courses.json saved.")

# 🎯 Split X and y
X = df.drop(columns=["labelCourseId"])
y = df["labelCourseId"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)




# List of models to try
models = {
    "RandomForest": RandomForestClassifier(n_estimators=150, class_weight="balanced", random_state=42),
    "GradientBoosting": GradientBoostingClassifier(n_estimators=150, learning_rate=0.1, random_state=42),
    "LogisticRegression": LogisticRegression(max_iter=1000),
    "SVC": SVC(probability=True)
}

# Train and evaluate each
for name, model in models.items():
    print(f"\n🧠 Training: {name}")
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    acc = model.score(X_test, y_test)
    print(f"✅ Accuracy: {acc * 100:.2f}%")
    print(f"📋 Classification Report for {name}:\n")
    print(classification_report(y_test, y_pred))

    # Save model
    joblib.dump(model, f"model_{name}.pkl")
    print(f"💾 Saved model_{name}.pkl")


# import pandas as pd
# import numpy as np
# import joblib
# import json
# from pymongo import MongoClient
# from collections import Counter
# from sklearn.model_selection import train_test_split
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.metrics import classification_report
# from sklearn.preprocessing import StandardScaler

# # MongoDB connection
# client = MongoClient("mongodb+srv://davidsinghrolson:l0kjL6nobVBEGKkB@cluster0.ruleu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
# db = client["test"]
# collection = db.testattempts

# # Fetch submitted attempts with labels
# attempts = list(collection.find({
#     "status": "Submitted",
#     "labelCourseId": {"$ne": None}
# }))

# print(f"Fetched {len(attempts)} records.")

# # Detect all topics dynamically
# available_topics = set()
# for attempt in attempts:
#     perf = attempt.get("topicWisePerformance", {})
#     available_topics.update(perf.keys())

# available_topics = sorted(list(available_topics))
# print(f"Detected Topics: {available_topics}")

# # Save topics for consistent use later
# with open("topics.json", "w") as f:
#     json.dump(available_topics, f)

# # Feature extraction
# def process(attempt):
#     perf = attempt.get("topicWisePerformance", {})
#     features = {topic: perf.get(topic, 0.0) for topic in available_topics}
#     features["testType"] = 0 if attempt.get("testType") == "Topic" else 1
#     features["avgPreviousPerformance"] = attempt.get("avgPreviousPerformance", 0.0)
#     features["avgQuestionDifficulty"] = attempt.get("avgQuestionDifficulty", 2.0)
#     features["labelCourseId"] = str(attempt["labelCourseId"])
#     return features

# # Create DataFrame
# df = pd.DataFrame([process(a) for a in attempts])

# # Drop rows with missing labels (just in case)
# df.dropna(subset=["labelCourseId"], inplace=True)

# # Features and Labels
# X = df.drop(columns=["labelCourseId"])
# y = df["labelCourseId"]

# # Optional: Print class distribution
# print("Label distribution:")
# print(Counter(y))

# # Stratified split to maintain label proportions
# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, stratify=y, random_state=42
# )

# # Optional: Normalize features (can skip for RandomForest)
# scaler = StandardScaler()
# X_train_scaled = scaler.fit_transform(X_train)
# X_test_scaled = scaler.transform(X_test)

# # Use RandomForest with some tuning
# model = RandomForestClassifier(
#     n_estimators=200,
#     max_depth=15,
#     random_state=42,
#     class_weight='balanced_subsample'  # Helps handle imbalance
# )
# model.fit(X_train_scaled, y_train)

# # Evaluate model
# accuracy = model.score(X_test_scaled, y_test)
# print(f"✅ Model Accuracy: {accuracy * 100:.2f}%")

# # Classification report (precision, recall, f1-score)
# y_pred = model.predict(X_test_scaled)
# print("\n📊 Classification Report:")
# print(classification_report(y_test, y_pred))

# # Save model and scaler
# joblib.dump(model, "recommendation_model.pkl")
# joblib.dump(scaler, "scaler.pkl")  # Save scaler if used

# print("✅ Model trained and saved successfully!")



# import pandas as pd
# import numpy as np
# import joblib
# import json
# from pymongo import MongoClient
# from sklearn.model_selection import train_test_split
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.metrics import classification_report
# from collections import Counter

# # MongoDB connection
# client = MongoClient("mongodb+srv://davidsinghrolson:l0kjL6nobVBEGKkB@cluster0.ruleu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
# db = client["test"]
# collection = db.testattempts

# # Fetch TestAttempt data
# attempts = list(collection.find({
#     "status": "Submitted",
#     "labelCourseId": {"$ne": None}
# }))

# print(f"Fetched {len(attempts)} records.")

# # Detect all topics dynamically
# available_topics = set()
# for attempt in attempts:
#     perf = attempt.get("topicWisePerformance", {})
#     available_topics.update(perf.keys())

# available_topics = sorted(list(available_topics))  # Always sorted
# print(f"Detected Topics: {available_topics}")

# # Save topics list for future use
# with open('topics.json', 'w') as f:
#     json.dump(available_topics, f)

# # Feature extraction
# def process(attempt):
#     perf = attempt.get("topicWisePerformance", {})
#     features = {topic: perf.get(topic, 0) for topic in available_topics}
#     features["testType"] = 0 if attempt.get("testType") == "Topic" else 1
#     features["avgPreviousPerformance"] = attempt.get("avgPreviousPerformance", 0)
#     features["avgQuestionDifficulty"] = attempt.get("avgQuestionDifficulty", 2)
#     features["labelCourseId"] = str(attempt["labelCourseId"])
#     return features

# # Create DataFrame
# df = pd.DataFrame([process(a) for a in attempts])

# # Filter out rare labels (less than 10 samples)
# label_counts = Counter(df["labelCourseId"])
# valid_labels = {label for label, count in label_counts.items() if count >= 10}

# print(f"Keeping {len(valid_labels)} labelCourseIds with ≥10 samples.")
# dropped_labels = set(label_counts.keys()) - valid_labels
# print(f"Dropped labels: {dropped_labels}")

# filtered_df = df[df["labelCourseId"].isin(valid_labels)]

# # Split data
# X = filtered_df.drop(columns=["labelCourseId"])
# y = filtered_df["labelCourseId"]

# # Stratified split
# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, stratify=y, random_state=42
# )

# # Train model
# # model = RandomForestClassifier(random_state=42)
# model = RandomForestClassifier(class_weight="balanced", random_state=42)

# model.fit(X_train, y_train)

# # Accuracy & classification report
# accuracy = model.score(X_test, y_test)
# print(f"✅ Model Accuracy: {accuracy * 100:.2f}%")

# y_pred = model.predict(X_test)
# print("📊 Classification Report:")
# print(classification_report(y_test, y_pred))

# # Save model
# joblib.dump(model, "recommendation_model.pkl")
# print("✅ Model trained and saved successfully!")
