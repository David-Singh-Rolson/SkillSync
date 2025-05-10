# # # # import pandas as pd
# # # # import numpy as np
# # # # import joblib
# # # # import json
# # # # from pymongo import MongoClient
# # # # from sklearn.model_selection import train_test_split
# # # # from sklearn.ensemble import RandomForestClassifier

# # # # # MongoDB connection
# # # # client = MongoClient("mongodb+srv://davidsinghrolson:l0kjL6nobVBEGKkB@cluster0.ruleu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
# # # # db = client["test"]  #  database name
# # # # collection = db.testattempts

# # # # # Fetch TestAttempt data
# # # # attempts = list(collection.find({
# # # #     "status": "Submitted",
# # # #     "labelCourseId": {"$ne": None}
# # # # }))

# # # # print(f"Fetched {len(attempts)} records.")

# # # # # Detect all topics dynamically
# # # # available_topics = set()
# # # # for attempt in attempts:
# # # #     perf = attempt.get("topicWisePerformance", {})
# # # #     available_topics.update(perf.keys())

# # # # available_topics = sorted(list(available_topics))  # Always sorted

# # # # print(f"Detected Topics: {available_topics}")

# # # # # Save topics list for future use
# # # # with open('topics.json', 'w') as f:
# # # #     json.dump(available_topics, f)

# # # # # Feature extraction
# # # # def process(attempt):
# # # #     perf = attempt.get("topicWisePerformance", {})
# # # #     features = {topic: perf.get(topic, 0) for topic in available_topics}
# # # #     features["testType"] = 0 if attempt.get("testType") == "Topic" else 1
# # # #     features["avgPreviousPerformance"] = attempt.get("avgPreviousPerformance", 0)
# # # #     features["avgQuestionDifficulty"] = attempt.get("avgQuestionDifficulty", 2)
# # # #     features["labelCourseId"] = str(attempt["labelCourseId"])
# # # #     return features

# # # # # Create DataFrame
# # # # df = pd.DataFrame([process(a) for a in attempts])

# # # # # Features and labels
# # # # X = df.drop(columns=["labelCourseId"])
# # # # y = df["labelCourseId"]

# # # # # Split into train/test
# # # # X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # # # # Train model
# # # # model = RandomForestClassifier()
# # # # model.fit(X_train, y_train)

# # # # # Accuracy
# # # # accuracy = model.score(X_test, y_test)
# # # # print(f"✅ Model Accuracy: {accuracy * 100:.2f}%")

# # # # # Save trained model
# # # # joblib.dump(model, "recommendation_model.pkl")

# # # # print("✅ Model trained and saved successfully!")

# # # import pandas as pd
# # # import numpy as np
# # # import joblib
# # # import json
# # # from pymongo import MongoClient
# # # from sklearn.model_selection import train_test_split
# # # from sklearn.ensemble import RandomForestClassifier
# # # from sklearn.metrics import classification_report
# # # from collections import Counter
# # # from sklearn.ensemble import GradientBoostingClassifier
# # # from sklearn.linear_model import LogisticRegression
# # # from sklearn.svm import SVC
# # # from sklearn.metrics import classification_report

# # # # 🔗 MongoDB Connection
# # # client = MongoClient("mongodb+srv://davidsinghrolson:l0kjL6nobVBEGKkB@cluster0.ruleu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
# # # db = client["test"]
# # # collection = db.testattempts

# # # # 📥 Fetch Records
# # # attempts = list(collection.find({
# # #     "status": "Submitted",
# # #     "labelCourseId": {"$ne": None}
# # # }))
# # # print(f"Fetched ✅ {len(attempts)} records.")

# # # # 🧠 Detect Topics
# # # available_topics = set()
# # # for attempt in attempts:
# # #     perf = attempt.get("topicWisePerformance", {})
# # #     available_topics.update(perf.keys())

# # # available_topics = sorted(list(available_topics))
# # # print(f"Detected Topics: {available_topics}")

# # # # 💾 Save topics
# # # with open('topics.json', 'w') as f:
# # #     json.dump(available_topics, f)
# # # print("✅ topics.json saved")

# # # # 🧪 Feature Engineering
# # # def process(attempt):
# # #     perf = attempt.get("topicWisePerformance", {})
# # #     features = {topic: perf.get(topic, 0) for topic in available_topics}
# # #     features["testType"] = 0 if attempt.get("testType") == "Topic" else 1
# # #     features["avgPreviousPerformance"] = float(attempt.get("avgPreviousPerformance", 0))
# # #     features["avgQuestionDifficulty"] = float(attempt.get("avgQuestionDifficulty", 2))
# # #     features["labelCourseId"] = str(attempt["labelCourseId"])
# # #     return features

# # # df = pd.DataFrame([process(a) for a in attempts])
# # # print("✅ DataFrame created.")

# # # # 📊 Class Distribution
# # # label_counts = df["labelCourseId"].value_counts()
# # # print("Course Distribution (label counts):")
# # # for label, count in label_counts.items():
# # #     print(f"→ {label}: {count} records")

# # # # ❌ Remove classes with < 10 samples
# # # min_required = 10
# # # valid_labels = label_counts[label_counts >= min_required].index
# # # df = df[df["labelCourseId"].isin(valid_labels)].reset_index(drop=True)
# # # print(f"✅ Remaining samples after filtering rare courses: {len(df)}")

# # # # 💾 Save courses
# # # with open('courses.json', 'w') as f:
# # #     json.dump(df["labelCourseId"].unique().tolist(), f)
# # # print("✅ courses.json saved.")

# # # # 🎯 Split X and y
# # # X = df.drop(columns=["labelCourseId"])
# # # y = df["labelCourseId"]

# # # X_train, X_test, y_train, y_test = train_test_split(
# # #     X, y, test_size=0.2, stratify=y, random_state=42
# # # )




# # # # List of models to try
# # # models = {
# # #     "RandomForest": RandomForestClassifier(n_estimators=150, class_weight="balanced", random_state=42),
# # #     "GradientBoosting": GradientBoostingClassifier(n_estimators=150, learning_rate=0.1, random_state=42),
# # #     "LogisticRegression": LogisticRegression(max_iter=1000),
# # #     "SVC": SVC(probability=True)
# # # }

# # # # Train and evaluate each
# # # for name, model in models.items():
# # #     print(f"\n🧠 Training: {name}")
# # #     model.fit(X_train, y_train)
# # #     y_pred = model.predict(X_test)
# # #     acc = model.score(X_test, y_test)
# # #     print(f"✅ Accuracy: {acc * 100:.2f}%")
# # #     print(f"📋 Classification Report for {name}:\n")
# # #     print(classification_report(y_test, y_pred))

# # #     # Save model
# # #     joblib.dump(model, f"model_{name}.pkl")
# # #     print(f"💾 Saved model_{name}.pkl")


# # # # import pandas as pd
# # # # import numpy as np
# # # # import joblib
# # # # import json
# # # # from pymongo import MongoClient
# # # # from collections import Counter
# # # # from sklearn.model_selection import train_test_split
# # # # from sklearn.ensemble import RandomForestClassifier
# # # # from sklearn.metrics import classification_report
# # # # from sklearn.preprocessing import StandardScaler

# # # # # MongoDB connection
# # # # client = MongoClient("mongodb+srv://davidsinghrolson:l0kjL6nobVBEGKkB@cluster0.ruleu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
# # # # db = client["test"]
# # # # collection = db.testattempts

# # # # # Fetch submitted attempts with labels
# # # # attempts = list(collection.find({
# # # #     "status": "Submitted",
# # # #     "labelCourseId": {"$ne": None}
# # # # }))

# # # # print(f"Fetched {len(attempts)} records.")

# # # # # Detect all topics dynamically
# # # # available_topics = set()
# # # # for attempt in attempts:
# # # #     perf = attempt.get("topicWisePerformance", {})
# # # #     available_topics.update(perf.keys())

# # # # available_topics = sorted(list(available_topics))
# # # # print(f"Detected Topics: {available_topics}")

# # # # # Save topics for consistent use later
# # # # with open("topics.json", "w") as f:
# # # #     json.dump(available_topics, f)

# # # # # Feature extraction
# # # # def process(attempt):
# # # #     perf = attempt.get("topicWisePerformance", {})
# # # #     features = {topic: perf.get(topic, 0.0) for topic in available_topics}
# # # #     features["testType"] = 0 if attempt.get("testType") == "Topic" else 1
# # # #     features["avgPreviousPerformance"] = attempt.get("avgPreviousPerformance", 0.0)
# # # #     features["avgQuestionDifficulty"] = attempt.get("avgQuestionDifficulty", 2.0)
# # # #     features["labelCourseId"] = str(attempt["labelCourseId"])
# # # #     return features

# # # # # Create DataFrame
# # # # df = pd.DataFrame([process(a) for a in attempts])

# # # # # Drop rows with missing labels (just in case)
# # # # df.dropna(subset=["labelCourseId"], inplace=True)

# # # # # Features and Labels
# # # # X = df.drop(columns=["labelCourseId"])
# # # # y = df["labelCourseId"]

# # # # # Optional: Print class distribution
# # # # print("Label distribution:")
# # # # print(Counter(y))

# # # # # Stratified split to maintain label proportions
# # # # X_train, X_test, y_train, y_test = train_test_split(
# # # #     X, y, test_size=0.2, stratify=y, random_state=42
# # # # )

# # # # # Optional: Normalize features (can skip for RandomForest)
# # # # scaler = StandardScaler()
# # # # X_train_scaled = scaler.fit_transform(X_train)
# # # # X_test_scaled = scaler.transform(X_test)

# # # # # Use RandomForest with some tuning
# # # # model = RandomForestClassifier(
# # # #     n_estimators=200,
# # # #     max_depth=15,
# # # #     random_state=42,
# # # #     class_weight='balanced_subsample'  # Helps handle imbalance
# # # # )
# # # # model.fit(X_train_scaled, y_train)

# # # # # Evaluate model
# # # # accuracy = model.score(X_test_scaled, y_test)
# # # # print(f"✅ Model Accuracy: {accuracy * 100:.2f}%")

# # # # # Classification report (precision, recall, f1-score)
# # # # y_pred = model.predict(X_test_scaled)
# # # # print("\n📊 Classification Report:")
# # # # print(classification_report(y_test, y_pred))

# # # # # Save model and scaler
# # # # joblib.dump(model, "recommendation_model.pkl")
# # # # joblib.dump(scaler, "scaler.pkl")  # Save scaler if used

# # # # print("✅ Model trained and saved successfully!")



# # # # import pandas as pd
# # # # import numpy as np
# # # # import joblib
# # # # import json
# # # # from pymongo import MongoClient
# # # # from sklearn.model_selection import train_test_split
# # # # from sklearn.ensemble import RandomForestClassifier
# # # # from sklearn.metrics import classification_report
# # # # from collections import Counter

# # # # # MongoDB connection
# # # # client = MongoClient("mongodb+srv://davidsinghrolson:l0kjL6nobVBEGKkB@cluster0.ruleu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
# # # # db = client["test"]
# # # # collection = db.testattempts

# # # # # Fetch TestAttempt data
# # # # attempts = list(collection.find({
# # # #     "status": "Submitted",
# # # #     "labelCourseId": {"$ne": None}
# # # # }))

# # # # print(f"Fetched {len(attempts)} records.")

# # # # # Detect all topics dynamically
# # # # available_topics = set()
# # # # for attempt in attempts:
# # # #     perf = attempt.get("topicWisePerformance", {})
# # # #     available_topics.update(perf.keys())

# # # # available_topics = sorted(list(available_topics))  # Always sorted
# # # # print(f"Detected Topics: {available_topics}")

# # # # # Save topics list for future use
# # # # with open('topics.json', 'w') as f:
# # # #     json.dump(available_topics, f)

# # # # # Feature extraction
# # # # def process(attempt):
# # # #     perf = attempt.get("topicWisePerformance", {})
# # # #     features = {topic: perf.get(topic, 0) for topic in available_topics}
# # # #     features["testType"] = 0 if attempt.get("testType") == "Topic" else 1
# # # #     features["avgPreviousPerformance"] = attempt.get("avgPreviousPerformance", 0)
# # # #     features["avgQuestionDifficulty"] = attempt.get("avgQuestionDifficulty", 2)
# # # #     features["labelCourseId"] = str(attempt["labelCourseId"])
# # # #     return features

# # # # # Create DataFrame
# # # # df = pd.DataFrame([process(a) for a in attempts])

# # # # # Filter out rare labels (less than 10 samples)
# # # # label_counts = Counter(df["labelCourseId"])
# # # # valid_labels = {label for label, count in label_counts.items() if count >= 10}

# # # # print(f"Keeping {len(valid_labels)} labelCourseIds with ≥10 samples.")
# # # # dropped_labels = set(label_counts.keys()) - valid_labels
# # # # print(f"Dropped labels: {dropped_labels}")

# # # # filtered_df = df[df["labelCourseId"].isin(valid_labels)]

# # # # # Split data
# # # # X = filtered_df.drop(columns=["labelCourseId"])
# # # # y = filtered_df["labelCourseId"]

# # # # # Stratified split
# # # # X_train, X_test, y_train, y_test = train_test_split(
# # # #     X, y, test_size=0.2, stratify=y, random_state=42
# # # # )

# # # # # Train model
# # # # # model = RandomForestClassifier(random_state=42)
# # # # model = RandomForestClassifier(class_weight="balanced", random_state=42)

# # # # model.fit(X_train, y_train)

# # # # # Accuracy & classification report
# # # # accuracy = model.score(X_test, y_test)
# # # # print(f"✅ Model Accuracy: {accuracy * 100:.2f}%")

# # # # y_pred = model.predict(X_test)
# # # # print("📊 Classification Report:")
# # # # print(classification_report(y_test, y_pred))

# # # # # Save model
# # # # joblib.dump(model, "recommendation_model.pkl")
# # # # print("✅ Model trained and saved successfully!")



# # # ----------------------------------------------------
# # # 🧠 SkillSync Course Recommendation Model Training
# # # ----------------------------------------------------

# # import pandas as pd
# # import numpy as np
# # import json
# # import joblib
# # from pymongo import MongoClient
# # from sklearn.model_selection import train_test_split
# # from sklearn.ensemble import RandomForestClassifier
# # from sklearn.metrics import classification_report

# # # STEP 1: Connect to MongoDB
# # client = MongoClient("mongodb+srv://davidsinghrolson:l0kjL6nobVBEGKkB@cluster0.ruleu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
# # db = client["test"]
# # collection = db.testattempts

# # # STEP 2: Fetch test attempts (Only with labelCourseId)
# # attempts = list(collection.find({
# #     "status": "Submitted",
# #     "labelCourseId": {"$ne": None}
# # }))
# # print(f"Fetched ✅ {len(attempts)} records.")

# # # STEP 3: Collect all topics from topicWisePerformance
# # topics_set = set()
# # for attempt in attempts:
# #     topics_set.update(attempt.get("topicWisePerformance", {}).keys())

# # topics = sorted(list(topics_set))
# # print(f"Detected Topics: {topics}")

# # # STEP 4: Save topics.json (needed in frontend too)
# # with open("topics.json", "w") as f:
# #     json.dump(topics, f)
# # print("✅ Saved topics.json")

# # # STEP 5: Feature Engineering Function
# # def build_features(attempt):
# #     perf = attempt.get("topicWisePerformance", {})
# #     features = {}

# #     # 5.1 Add topic-wise performance features
# #     for topic in topics:
# #         features[f"topic_{topic}"] = perf.get(topic, 0)

# #     # 5.2 Add test type (0 = Topic, 1 = Mixed)
# #     features["testType"] = 0 if attempt.get("testType") == "Topic" else 1

# #     # 5.3 Add average previous performance
# #     features["avgPreviousPerformance"] = float(attempt.get("avgPreviousPerformance", 0))

# #     # 5.4 Add average question difficulty
# #     features["avgQuestionDifficulty"] = float(attempt.get("avgQuestionDifficulty", 2))

# #     # 5.5 Add accuracy (score / totalMarks)
# #     score = attempt.get("score", 0)
# #     total_marks = attempt.get("totalMarks", 1)
# #     features["accuracy"] = round(score / total_marks, 2)

# #     # 5.6 Add consistency (std dev of topic scores)
# #     topic_scores = list(perf.values())
# #     features["consistency"] = round(np.std(topic_scores), 2) if topic_scores else 0

# #     # 5.7 Add labelCourseId as target class
# #     features["label"] = str(attempt["labelCourseId"])
# #     return features

# # # STEP 6: Convert all attempts into a DataFrame
# # df = pd.DataFrame([build_features(a) for a in attempts])
# # print("✅ DataFrame created with enhanced features.")

# # # STEP 7: Show course distribution
# # label_counts = df["label"].value_counts()
# # print("Course Distribution (label counts):")
# # for course_id, count in label_counts.items():
# #     print(f"→ {course_id}: {count} records")

# # # STEP 8: Remove courses with < 10 samples
# # min_required = 10
# # valid_labels = label_counts[label_counts >= min_required].index.tolist()
# # df = df[df["label"].isin(valid_labels)].reset_index(drop=True)
# # print(f"✅ Remaining samples after filtering rare courses: {len(df)}")

# # # STEP 9: Save course labels
# # with open("courses.json", "w") as f:
# #     json.dump(df["label"].unique().tolist(), f)
# # print("✅ courses.json saved.")

# # # STEP 10: Prepare X and y
# # X = df.drop(columns=["label"])
# # y = df["label"]

# # # STEP 11: Train/test split
# # X_train, X_test, y_train, y_test = train_test_split(
# #     X, y, test_size=0.2, stratify=y, random_state=42
# # )

# # # STEP 12: Train RandomForest model
# # model = RandomForestClassifier(n_estimators=150, class_weight="balanced", random_state=42)
# # model.fit(X_train, y_train)

# # # STEP 13: Accuracy & classification report
# # y_pred = model.predict(X_test)
# # acc = model.score(X_test, y_test)
# # print(f"\n✅ Accuracy: {acc * 100:.2f}%")
# # print("\n📋 Classification Report:")
# # print(classification_report(y_test, y_pred))

# # # STEP 14: Save model
# # joblib.dump(model, "recommendation_model.pkl")
# # print("✅ Model saved as recommendation_model.pkl")


# # ---------------- train_model.py ----------------

# import pandas as pd
# import numpy as np
# import json
# import joblib
# from pymongo import MongoClient
# from sklearn.model_selection import train_test_split
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.metrics import classification_report
# from sklearn.preprocessing import StandardScaler

# # Step 1: Connect to MongoDB
# client = MongoClient("mongodb+srv://davidsinghrolson:l0kjL6nobVBEGKkB@cluster0.ruleu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
# db = client["test"]
# collection = db.testattempts

# # Step 2: Fetch only submitted attempts with labelCourseId
# attempts = list(collection.find({
#     "status": "Submitted",
#     "labelCourseId": {"$ne": None}
# }))
# print(f"Fetched ✅ {len(attempts)} records.")

# # Step 3: Collect unique topics
# available_topics = sorted(list({
#     topic for attempt in attempts
#     for topic in attempt.get("topicWisePerformance", {}).keys()
# }))
# print(f"Detected Topics: {available_topics}")

# # Save topics.json
# with open("topics.json", "w") as f:
#     json.dump(available_topics, f)
# print("✅ Saved topics.json")

# # Step 4: Process each attempt into a feature dict
# def extract_features(attempt):
#     perf = attempt.get("topicWisePerformance", {})
#     features = {topic: perf.get(topic, 0) for topic in available_topics}

#     # Basic features
#     features["testType"] = 0 if attempt.get("testType") == "Topic" else 1
#     features["avgPreviousPerformance"] = float(attempt.get("avgPreviousPerformance", 0))
#     features["avgQuestionDifficulty"] = float(attempt.get("avgQuestionDifficulty", 2))
#     features["totalMarks"] = float(attempt.get("totalMarks", 0))
#     features["score"] = float(attempt.get("score", 0))
    
#     # New engineered features
#     scores = list(perf.values()) if perf else [0]
#     features["totalTopicsAttempted"] = len(perf)
#     features["consistencyScore"] = round(np.std(scores), 2)  # std dev of topic scores
#     features["maxTopicScore"] = max(scores)
#     features["minTopicScore"] = min(scores)
#     features["score_ratio"] = round(features["score"] / features["totalMarks"], 2) if features["totalMarks"] else 0

#     # Label
#     features["labelCourseId"] = str(attempt["labelCourseId"])
#     return features

# # Step 5: DataFrame banaye
# df = pd.DataFrame([extract_features(a) for a in attempts])
# print("✅ DataFrame created with enhanced features.")

# # Step 6: Class balance cleanup
# label_counts = df["labelCourseId"].value_counts()
# print("Course Distribution (label counts):")
# for lbl, count in label_counts.items():
#     print(f"→ {lbl}: {count} records")

# # Remove courses with <10 records
# df = df[df["labelCourseId"].isin(label_counts[label_counts >= 10].index)].reset_index(drop=True)
# print(f"✅ Remaining samples after filtering rare courses: {len(df)}")

# # Save course IDs
# with open("courses.json", "w") as f:
#     json.dump(df["labelCourseId"].unique().tolist(), f)
# print("✅ courses.json saved.")

# # Step 7: Train/Test Split
# X = df.drop(columns=["labelCourseId"])
# y = df["labelCourseId"]

# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, stratify=y, random_state=42
# )

# # Step 8: Feature Scaling
# scaler = StandardScaler()
# X_train_scaled = scaler.fit_transform(X_train)
# X_test_scaled = scaler.transform(X_test)

# # Step 9: Model Training
# model = RandomForestClassifier(n_estimators=200, class_weight="balanced", random_state=42)
# model.fit(X_train_scaled, y_train)

# # Step 10: Evaluation
# y_pred = model.predict(X_test_scaled)
# accuracy = model.score(X_test_scaled, y_test)
# print(f"\n✅ Accuracy: {accuracy * 100:.2f}%\n")
# print("📋 Classification Report:")
# print(classification_report(y_test, y_pred))

# # Step 11: Save model
# joblib.dump(model, "recommendation_model.pkl")
# print("✅ Model saved as recommendation_model.pkl")


import pandas as pd
import numpy as np
import json
import joblib
from pymongo import MongoClient
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.preprocessing import StandardScaler

# Step 1: Connect to MongoDB
client = MongoClient("mongodb+srv://davidsinghrolson:l0kjL6nobVBEGKkB@cluster0.ruleu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["test"]
collection = db.testattempts

# Step 2: Fetch only submitted attempts with labelCourseId
attempts = list(collection.find({
    "status": "Submitted",
    "labelCourseId": {"$ne": None}
}))
print(f"Fetched ✅ {len(attempts)} records.")

# Step 3: Detect all topics used across all attempts
available_topics = sorted(list({
    topic for attempt in attempts
    for topic in attempt.get("topicWisePerformance", {}).keys()
}))
print(f"Detected Topics: {available_topics}")

# Save topics.json
with open("topics.json", "w") as f:
    json.dump(available_topics, f)
print("✅ Saved topics.json")

# Step 4: Extract features for each attempt
def extract_features(attempt):
    perf = attempt.get("topicWisePerformance", {})
    scores = list(perf.values()) if perf else [0]

    features = {topic: perf.get(topic, 0) for topic in available_topics}

    # Basic features
    features["testType"] = 0 if attempt.get("testType") == "Topic" else 1
    features["avgPreviousPerformance"] = float(attempt.get("avgPreviousPerformance", 0))
    features["avgQuestionDifficulty"] = float(attempt.get("avgQuestionDifficulty", 2))
    features["totalMarks"] = float(attempt.get("totalMarks", 0))
    features["score"] = float(attempt.get("score", 0))

    # New Rule-Based features (these come from test submission time)
    features["score_ratio"] = round(features["score"] / features["totalMarks"], 2) if features["totalMarks"] else 0
    features["overallAccuracy"] = float(attempt.get("overallAccuracy", 0))
    features["totalTopicsAttempted"] = len(perf)
    features["consistencyScore"] = round(np.std(scores), 2)
    features["maxTopicScore"] = max(scores)
    features["minTopicScore"] = min(scores)

    # Label
    features["labelCourseId"] = str(attempt["labelCourseId"])
    return features

# Step 5: Create DataFrame
df = pd.DataFrame([extract_features(a) for a in attempts])
print("✅ DataFrame created with enhanced features.")

# Step 6: Filter labels with < 10 samples
label_counts = df["labelCourseId"].value_counts()
print("Course Distribution (label counts):")
for lbl, count in label_counts.items():
    print(f"→ {lbl}: {count} records")

df = df[df["labelCourseId"].isin(label_counts[label_counts >= 10].index)].reset_index(drop=True)
print(f"✅ Remaining samples after filtering rare courses: {len(df)}")

# Save course IDs
with open("courses.json", "w") as f:
    json.dump(df["labelCourseId"].unique().tolist(), f)
print("✅ courses.json saved.")

# Step 7: Train/test split
X = df.drop(columns=["labelCourseId"])
y = df["labelCourseId"]

if df.empty:
    print("no valid data for training")
    exit()
    
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# Step 8: Feature scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Step 9: Train RandomForest
model = RandomForestClassifier(n_estimators=200, class_weight="balanced", random_state=42)
model.fit(X_train_scaled, y_train)

# Step 10: Evaluation
y_pred = model.predict(X_test_scaled)
accuracy = model.score(X_test_scaled, y_test)
print(f"\n✅ Accuracy: {accuracy * 100:.2f}%\n")
print("📋 Classification Report:")
print(classification_report(y_test, y_pred))
print("Shape of X_train:", X_train.shape)
print("Shape of input_df:", input_df.shape)

# Step 11: Save trained model
joblib.dump(model, "recommendation_model.pkl")
print("✅ Model saved as recommendation_model.pkl")