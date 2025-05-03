# from faker import Faker
# import random
# import json
# from pymongo import MongoClient
# from datetime import datetime

# # Initialize Faker
# fake = Faker()

# # MongoDB connection
# client = MongoClient("mongodb+srv://davidsinghrolson:l0kjL6nobVBEGKkB@cluster0.ruleu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
# db = client["test"]  # 🔥 Change this to your real database name
# collection = db.testattempts

# # List of fake topics
# topics = ['DBMS', 'DSA', 'Programming']

# # Function to generate a fake test attempt document
# def generate_fake_attempt():
#     attempt = {
#         "student": fake.uuid4(),
#         "test": fake.uuid4(),
#         "responses": [fake.text(max_nb_chars=100) for _ in range(5)],
#         "totalMarks": random.randint(5, 20),
#         "score": random.randint(0, 5),
#         "status": "Submitted",
#         "topicWisePerformance": {topic: random.uniform(0, 5) for topic in topics},
#         "avgQuestionDifficulty": round(random.uniform(1, 2), 1),
#         "avgPreviousPerformance": str(random.randint(10, 100)),
#         "labelCourseId": fake.uuid4(),
#         "testType": random.choice(["Topic", "Mixed"]),
#         "createdAt": datetime.now(),  # Use datetime.now() instead of fake.date_this_year()
#         "updatedAt": datetime.now(),  # Use datetime.now() instead of fake.date_this_year()
#     }
#     return attempt

# # Generate and insert 10 fake records
# fake_data = [generate_fake_attempt() for _ in range(10)]

# # Insert data into MongoDB
# collection.insert_many(fake_data)

# print(f"✅ {len(fake_data)} fake records inserted into MongoDB!")



# from faker import Faker
# import random
# from datetime import datetime, timedelta
# from pymongo import MongoClient
# from bson import ObjectId
# from dotenv import load_dotenv
# import os


# # Load environment variables from .env file
# load_dotenv()

# # 🔗 CONNECT TO MONGO

# MONGO_URI = os.getenv("MONGO_URI")
# DB_NAME = os.getenv("DB_NAME")

# # Connect to MongoDB
# client = MongoClient(MONGO_URI)
# db = client[DB_NAME]
# # Init faker
# fake = Faker()

# # Topic pool
# topics = ['DBMS', 'DSA', 'Programming', 'Maths', 'OOP','Java']

# # 1️⃣ USERS
# users = []
# for _ in range(200):
#     user = {
#         "name": fake.name(),
#         "email": fake.unique.email(),
#         "password": "$2a$10$gUC0HlEuA8pSQCqDlQEnQO/KMjxV9/1lShrrZy1mj1FDX..QZol2K",
#         "role": "student",
#         "enrolledCourses": [],
#         "photoUrl": "",
#         "createdAt": datetime.now(),
#         "updatedAt": datetime.now()
#     }
#     users.append(user)
# user_ids = db.users.insert_many(users).inserted_ids

# # Check if instructors already exist
# existing_teachers = list(db.users.find({"role": "instructor"}))

# # if existing_teachers:
# #     teacher_ids = [t["_id"] for t in existing_teachers]
# # else:
# teachers = []
# for _ in range(3):
#     teacher = {
#         "name": fake.name(),
#         "email": fake.unique.email(),
#         "password": "hashed_password",
#         "role": "instructor",
#         "enrolledCourses": [],
#         "photoUrl": "",
#         "createdAt": datetime.now(),
#         "updatedAt": datetime.now()
#     }
#     teachers.append(teacher)
# teacher_ids = db.users.insert_many(teachers).inserted_ids


# # Insert teachers separately
# # teacher_ids = db.users.insert_many(teachers).inserted_ids
# # 2️⃣ COURSES + LECTURES
# course_titles = ['DBMS', 'DSA', 'Python', 'OOP', 'Maths', 'MongoDB','Java']
# courses = []
# lectures = []

# for title in course_titles:
#     lecture_id = ObjectId()
#     lectures.append({
#         "_id": lecture_id,
#         "lectureTitle": f"Intro to {title}",
#         "isPreviewFree": random.choice([True, False]),
#         "createdAt": datetime.now(),
#         "updatedAt": datetime.now()
#     })

#     course = {
#         "courseTitle": title,
#         "category": title,
#         "courseLevel": random.choice(["Beginner", "Medium", "Advanced"]),
#         "coursePrice": random.choice([0, 99, 199]),
#         "subTitle": f"Learn {title} from scratch",
#         "description": f"<p>Comprehensive course on {title}</p>",
#         "lectures": [lecture_id],
#         "enrolledStudents": [],
#         "creator": random.choice(teacher_ids),
#         "isPublished": True,
#         "createdAt": datetime.now(),
#         "updatedAt": datetime.now()
#     }
#     courses.append(course)

# lecture_ids = db.lectures.insert_many(lectures).inserted_ids
# course_ids = db.courses.insert_many(courses).inserted_ids

# # 3️⃣ QUESTIONS (all types)
# questions = []
# question_types = ["SingleCorrect", "MultiCorrect", "TrueFalse", "Integer", "ShortAnswer"]

# for _ in range(90):
#     qtype = random.choice(question_types)
#     options = [fake.word() for _ in range(random.randint(2, 4))]

#     q = {
#         "questionText": fake.sentence(nb_words=6),
#         "options": options,
#         "correctOptionIndex": 0 if qtype == "SingleCorrect" else None,
#         "correctOptionIndexes": [0, 1] if qtype == "MultiCorrect" else [],
#         "correctAnswer": str(random.randint(1, 100)) if qtype == "Integer" else None,
#         "topic": random.choice(topics),
#         "difficulty": random.choice(["Easy", "Medium", "Hard"]),
#         "marks": random.choice([1, 2, 5]),
#         "questionType": qtype,
#         "isActive": True,
#         "createdBy": random.choice(user_ids),
#         "createdAt": datetime.now(),
#         "updatedAt": datetime.now()
#     }

#     questions.append(q)

# question_ids = db.questions.insert_many(questions).inserted_ids

# # 4️⃣ TESTS (Topic & Mixed)
# tests = []

# for i in range(5):  # Topic-specific
#     selected_questions = random.sample(question_ids, 5)
#     course = random.choice(course_ids)
#     test = {
#         "testTitle": f"Topic Test {i+1}",
#         "course": course,
#         "testType": "Topic",
#         "testLevel": random.choice(["Beginner", "Medium", "Advanced"]),
#         "timeLimit": 30,
#         "totalMarks": 10,
#         "instructions": "<p>Attempt All questions</p>",
#         "questions": selected_questions,
#         "isPublished": True,
#         "startTime": datetime.now(),
#         "endTime": datetime.now() + timedelta(days=3),
#         "isScheduled": True,
#         "createdBy": random.choice(user_ids),
#         "createdAt": datetime.now(),
#         "updatedAt": datetime.now()
#     }
#     tests.append(test)

# for i in range(10):  # Mixed
#     selected_questions = random.sample(question_ids, 8)
#     test = {
#         "testTitle": f"Mixed Test {i+1}",
#         "course": None,
#         "testType": "Mixed",
#         "testLevel": "Medium",
#         "timeLimit": 45,
#         "totalMarks": 20,
#         "instructions": "<p>Mixed topic test</p>",
#         "questions": selected_questions,
#         "isPublished": True,
#         "startTime": datetime.now(),
#         "endTime": datetime.now() + timedelta(days=3),
#         "isScheduled": True,
#         "createdBy": random.choice(user_ids),
#         "createdAt": datetime.now(),
#         "updatedAt": datetime.now()
#     }
#     tests.append(test)

# test_ids = db.tests.insert_many(tests).inserted_ids

# # 5️⃣ TEST ATTEMPTS
# test_attempts = []

# for _ in range(500):
#     student = random.choice(user_ids)
#     test_index = random.randint(0, len(test_ids) - 1)
#     test_id = test_ids[test_index]
#     test_obj = db.tests.find_one({"_id": test_id})
#     q_ids = test_obj["questions"]

#     responses = []
#     score = 0
#     topic_scores = {}
#     for q_id in q_ids:
#         q = db.questions.find_one({"_id": q_id})
#         is_correct = random.choice([True, False])
#         awarded = q["marks"] if is_correct else 0
#         score += awarded

#         # topic-wise score
#         topic = q["topic"]
#         if topic not in topic_scores:
#             topic_scores[topic] = []
#         topic_scores[topic].append(awarded)

#         responses.append({
#             "question": q_id,
#             "selectedOptionIndex": random.randint(0, len(q["options"]) - 1) if q["options"] else None,
#             "isCorrect": is_correct,
#             "topic": topic,
#             "marksAwarded": awarded
#         })

#     topicWisePerformance = {k: round(sum(v) / len(v), 2) for k, v in topic_scores.items()}
#     test_attempts.append({
#         "student": student,
#         "test": test_id,
#         "responses": responses,
#         "totalMarks": test_obj["totalMarks"],
#         "score": score,
#         "status": "Submitted",
#         "topicWisePerformance": topicWisePerformance,
#         "avgQuestionDifficulty": round(random.uniform(1.0, 2.0), 1),
#         "avgPreviousPerformance": round(random.uniform(30, 80), 2),
#         "labelCourseId": random.choice(course_ids),
#         "testType": test_obj["testType"],
#         "createdAt": datetime.now(),
#         "updatedAt": datetime.now()
#     })

# db.testattempts.insert_many(test_attempts)

# print("✅ All dummy data inserted successfully!")



# -----------------------------
# ✅ 0. Import necessary modules
# -----------------------------
from faker import Faker
import random
from datetime import datetime, timedelta
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os

# -----------------------------
# ✅ 1. Load MongoDB credentials from .env
# -----------------------------
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

# -----------------------------
# ✅ 2. Connect to MongoDB
# -----------------------------
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
fake = Faker()

# -----------------------------
# ✅ 3. Define topic pool
# -----------------------------
topics = ['DBMS', 'DSA', 'Programming', 'Maths', 'OOP', 'Java']

# -----------------------------
# ✅ 4. Fetch required references
# -----------------------------
students = list(db.users.find({"role": "student"}, {"_id": 1}))
student_ids = [s["_id"] for s in students]

tests = list(db.tests.find({"isPublished": True}))
test_ids = [t["_id"] for t in tests]
test_map = {str(t["_id"]): t for t in tests}

courses = list(db.courses.find({}, {"_id": 1}))
course_ids = [c["_id"] for c in courses]

# -----------------------------
# ✅ 5. Balanced generation logic
# For each course, generate N test attempts
# -----------------------------
test_attempts = []
attempts_per_course = 50  # you can change this to 100 or 200 if needed

for course_id in course_ids:
    for _ in range(attempts_per_course):
        student = random.choice(student_ids)
        test_obj = random.choice(tests)
        test_id = test_obj["_id"]
        q_ids = test_obj.get("questions", [])

        responses = []
        score = 0
        topic_scores = {}

        for q_id in q_ids:
            q = db.questions.find_one({"_id": q_id})
            if not q:
                continue

            is_correct = random.choice([True, False])
            awarded = q["marks"] if is_correct else 0
            score += awarded

            topic = q.get("topic", "Unknown")
            if topic not in topic_scores:
                topic_scores[topic] = []
            topic_scores[topic].append(awarded)

            responses.append({
                "question": q_id,
                "selectedOptionIndex": random.randint(0, len(q.get("options", [])) - 1) if q.get("options") else None,
                "isCorrect": is_correct,
                "topic": topic,
                "marksAwarded": awarded
            })

        topicWisePerformance = {
            k: round(sum(v) / len(v), 2) for k, v in topic_scores.items()
        }

        test_attempts.append({
            "student": student,
            "test": test_id,
            "responses": responses,
            "totalMarks": test_obj.get("totalMarks", 10),
            "score": score,
            "status": "Submitted",
            "topicWisePerformance": topicWisePerformance,
            "avgQuestionDifficulty": round(random.uniform(1.0, 2.0), 1),
            "avgPreviousPerformance": round(random.uniform(30, 80), 2),
            "labelCourseId": course_id,
            "testType": test_obj.get("testType", "Mixed"),
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        })

# -----------------------------
# ✅ 6. Insert all generated test attempts
# -----------------------------
db.testattempts.insert_many(test_attempts)

# -----------------------------
# ✅ 7. Done!
# -----------------------------
print(f"✅ Inserted {len(test_attempts)} balanced test attempts successfully.")