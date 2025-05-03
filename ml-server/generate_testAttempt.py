# # ------------------------ generate_test_attempts.py ------------------------

# from faker import Faker
# import random
# from datetime import datetime
# from pymongo import MongoClient
# from bson import ObjectId
# from dotenv import load_dotenv
# import os

# # STEP 1: Load environment variables
# load_dotenv()
# MONGO_URI = os.getenv("MONGO_URI")
# DB_NAME = os.getenv("DB_NAME")

# # STEP 2: Connect to MongoDB
# client = MongoClient(MONGO_URI)
# db = client[DB_NAME]

# # STEP 3: Init Faker
# fake = Faker()

# # STEP 4: Fetch all students (role = student)
# students = list(db.users.find({"role": "student"}, {"_id": 1}))
# if not students:
#     print("⚠ No students found in database!")
#     exit()


# # STEP 5: Fetch all tests (make sure tests exist)
# tests = list(db.tests.find({}, {"_id": 1, "questions": 1, "testType": 1, "totalMarks": 1}))
# if not tests:
#     print("⚠ No tests found in database!")
#     exit()

# # STEP 6: Fetch all course IDs for labelCourseId reference
# courses = list(db.courses.find({}, {"_id": 1}))
# if not courses:
#     print("⚠ No courses found in database!")
#     exit()
# course_ids = [course["_id"] for course in courses]

# # STEP 7: Begin creating test attempts
# test_attempts = []
# attempts_per_user = 10  # You can change this number anytime

# for student in students:
#     student_id = student["_id"]
#     for _ in range(attempts_per_user):
#         # Pick a random test
#         test = random.choice(tests)
#         test_id = test["_id"]
#         q_ids = test["questions"]
#         total_marks = test["totalMarks"]
#         test_type = test["testType"]

#         responses = []
#         score = 0
#         topic_scores = {}

#         # For each question in test
#         for q_id in q_ids:
#             q = db.questions.find_one({"_id": q_id})
#             if not q:
#                 continue  # Skip if question not found

#             is_correct = random.choice([True, False])
#             awarded = q["marks"] if is_correct else 0
#             score += awarded

#             topic = q["topic"]
#             topic_scores.setdefault(topic, []).append(awarded)

#             responses.append({
#                 "question": q_id,
#                 "selectedOptionIndex": random.randint(0, len(q["options"]) - 1) if q["options"] else None,
#                 "isCorrect": is_correct,
#                 "topic": topic,
#                 "marksAwarded": awarded
#             })

#         # Calculate average score per topic
#         topicWisePerformance = {k: round(sum(v)/len(v), 2) for k, v in topic_scores.items()}

#         # Final test attempt object
#         test_attempts.append({
#             "student": student_id,
#             "test": test_id,
#             "responses": responses,
#             "totalMarks": total_marks,
#             "score": score,
#             "status": "Submitted",
#             "topicWisePerformance": topicWisePerformance,
#             "avgQuestionDifficulty": round(random.uniform(1.0, 2.0), 1),
#             "avgPreviousPerformance": round(random.uniform(30, 80), 2),
#             "labelCourseId": random.choice(course_ids),
#             "testType": test_type,
#             "createdAt": datetime.now(),
#             "updatedAt": datetime.now()
#         })

# # STEP 8: Insert into DB
# if test_attempts:
#     db.testattempts.insert_many(test_attempts)
#     print(f"✅ Inserted {len(test_attempts)} test attempts successfully!")
# else:
#     print("⚠ No attempts created.")

# ------------------------ generate_test_attempts.py ------------------------

from faker import Faker
import random
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os

# STEP 1️⃣: Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

# STEP 2️⃣: Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# STEP 3️⃣: Init Faker
fake = Faker()

# STEP 4️⃣: Fetch all students (role = student)
students = list(db.users.find({"role": "student"}, {"_id": 1}))
print(f"👨‍🎓 Total students found: {len(students)}")
if not students:
    print("⚠ No students found in DB. Run generate_seed_data.py first!")
    exit()

# STEP 5️⃣: Fetch all tests
tests = list(db.tests.find({}, {"_id": 1, "questions": 1, "testType": 1, "totalMarks": 1}))
print(f"🧪 Total tests found: {len(tests)}")
if not tests:
    print("⚠ No tests found in DB. Run generate_seed_data.py first!")
    exit()

# STEP 6️⃣: Fetch all courses
courses = list(db.courses.find({}, {"_id": 1}))
print(f"📚 Total courses found: {len(courses)}")
if not courses:
    print("⚠ No courses found in DB. Run generate_seed_data.py first!")
    exit()

course_ids = [course["_id"] for course in courses]

# STEP 7️⃣: Begin test attempt generation
test_attempts = []
attempts_per_user = 10  # 🔁 You can modify this safely

for student in students:
    student_id = student["_id"]
    for _ in range(attempts_per_user):
        # Pick a random test
        test = random.choice(tests)
        test_id = test["_id"]
        q_ids = test.get("questions", [])
        total_marks = test.get("totalMarks", 0)
        test_type = test.get("testType", "Topic")

        # Skip test if no questions inside
        if not q_ids:
            print(f"⚠ Test {test_id} has no questions. Skipping...")
            continue

        responses = []
        score = 0
        topic_scores = {}

        for q_id in q_ids:
            q = db.questions.find_one({"_id": q_id})
            if not q:
                print(f"⚠ Question {q_id} not found. Skipping...")
                continue

            is_correct = random.choice([True, False])
            awarded = q["marks"] if is_correct else 0
            score += awarded

            topic = q["topic"]
            topic_scores.setdefault(topic, []).append(awarded)

            responses.append({
                "question": q_id,
                "selectedOptionIndex": random.randint(0, len(q["options"]) - 1) if q["options"] else None,
                "isCorrect": is_correct,
                "topic": topic,
                "marksAwarded": awarded
            })

        if not responses:
            print(f"⚠ No responses generated for test {test_id}. Skipping...")
            continue

        topicWisePerformance = {k: round(sum(v)/len(v), 2) for k, v in topic_scores.items()}

        test_attempts.append({
            "student": student_id,
            "test": test_id,
            "responses": responses,
            "totalMarks": total_marks,
            "score": score,
            "status": "Submitted",
            "topicWisePerformance": topicWisePerformance,
            "avgQuestionDifficulty": round(random.uniform(1.0, 2.0), 1),
            "avgPreviousPerformance": round(random.uniform(30, 80), 2),
            "labelCourseId": random.choice(course_ids),
            "testType": test_type,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        })

# STEP 8️⃣: Insert test attempts into DB
print(f"📦 Prepared {len(test_attempts)} test attempts to insert...")

if test_attempts:
    try:
        db.testattempts.insert_many(test_attempts, ordered=False)
        print(f"✅ Successfully inserted {len(test_attempts)} test attempts.")
    except Exception as e:
        print("❌ Insert failed! Error:", e)
else:
    print("⚠ No valid test attempts to insert.")