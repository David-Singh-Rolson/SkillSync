from faker import Faker
import random
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os
from collections import defaultdict

# ---------------------------------------------
# 1️⃣ Load ENV and Connect to MongoDB
# ---------------------------------------------
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
fake = Faker()

# ---------------------------------------------
# 2️⃣ Fetch Required Collections
# ---------------------------------------------
users = list(db.users.find({"role": "student"}, {"_id": 1}))
courses = list(db.courses.find({}, {"_id": 1}))
tests = list(db.tests.find({}, {"_id": 1, "questions": 1, "testType": 1, "totalMarks": 1}))
questions_dict = {q["_id"]: q for q in db.questions.find({})}

if not users or not courses or not tests or not questions_dict:
    print("❌ One or more collections are empty. Aborting.")
    exit()

user_ids = [u["_id"] for u in users]
course_ids = [c["_id"] for c in courses]
test_data = tests

# ---------------------------------------------
# 3️⃣ Init Usage Trackers for Logging
# ---------------------------------------------
test_usage = defaultdict(int)
course_usage = defaultdict(int)
topic_usage = defaultdict(int)

# ---------------------------------------------
# 4️⃣ Begin TestAttempt Generation
# ---------------------------------------------
test_attempts = []
test_index = 0
course_index = 0

for user_id in user_ids:
    for _ in range(30):  # 🔁 Each user gets 30 attempts

        # 🔁 Round-robin test & course assignment
        test_obj = test_data[test_index % len(test_data)]
        labelCourseId = course_ids[course_index % len(course_ids)]

        test_index += 1
        course_index += 1

        test_id = test_obj["_id"]
        testType = test_obj["testType"]
        totalMarks = test_obj["totalMarks"]
        question_ids = test_obj["questions"]

        responses = []
        score = 0
        topic_scores = {}

        for q_id in question_ids:
            q = questions_dict.get(q_id)
            if not q:
                continue

            is_correct = random.choice([True, False])
            awarded = q["marks"] if is_correct else 0
            score += awarded
            topic = q["topic"]
            topic_usage[topic] += 1

            topic_scores.setdefault(topic, []).append(awarded)

            responses.append({
                "question": q_id,
                "selectedOptionIndex": random.randint(0, len(q["options"]) - 1) if q["options"] else None,
                "isCorrect": is_correct,
                "topic": topic,
                "marksAwarded": awarded
            })

        topicWisePerformance = {k: round(sum(v) / len(v), 2) for k, v in topic_scores.items()}

        test_attempts.append({
            "student": user_id,
            "test": test_id,
            "responses": responses,
            "totalMarks": totalMarks,
            "score": score,
            "status": "Submitted",
            "topicWisePerformance": topicWisePerformance,
            "avgQuestionDifficulty": round(random.uniform(1.0, 2.0), 1),
            "avgPreviousPerformance": round(random.uniform(30, 80), 2),
            "labelCourseId": labelCourseId,
            "testType": testType,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        })

        test_usage[str(test_id)] += 1
        course_usage[str(labelCourseId)] += 1

# ---------------------------------------------
# 5️⃣ Insert into DB
# ---------------------------------------------
if test_attempts:
    db.testattempts.insert_many(test_attempts)
    print(f"✅ Inserted {len(test_attempts)} test attempts successfully!")
else:
    print("❌ No test attempts generated.")

# ---------------------------------------------
# 6️⃣ Print Stats Log (Analytics)
# ---------------------------------------------
print("\n📊 Test Usage Distribution:")
for k, v in sorted(test_usage.items(), key=lambda x: x[1], reverse=True):
    print(f"→ Test {k}: {v} attempts")

print("\n📘 Course Usage Distribution:")
for k, v in sorted(course_usage.items(), key=lambda x: x[1], reverse=True):
    print(f"→ Course {k}: {v} labels")

print("\n📚 Topic Usage Distribution:")
for k, v in sorted(topic_usage.items(), key=lambda x: x[1], reverse=True):
    print(f"→ Topic '{k}': {v} appearances")