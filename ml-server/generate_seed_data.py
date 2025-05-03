from faker import Faker
import random
from datetime import datetime, timedelta
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os

# 🌱 Load environment variables from .env
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

# 🌐 Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# 🧹 Clean all relevant collections to avoid duplicates (optional safety)
db.users.delete_many({})
db.courses.delete_many({})
db.lectures.delete_many({})
db.questions.delete_many({})
db.tests.delete_many({})
db.testattempts.delete_many({})

# 🎭 Initialize Faker
fake = Faker()

# 🎯 Define common topics
topics = ['DBMS', 'DSA', 'Programming', 'Maths', 'OOP', 'Java','Physics','Chemistry','AI','ML']

# 1️⃣ Create Users: 200 students
students = []
for _ in range(200):
    students.append({
        "name": fake.name(),
        "email": fake.unique.email(),
        "password": "$2a$10$demoFakeHashedPasswordForAllStudents",
        "role": "student",
        "enrolledCourses": [],
        "photoUrl": "",
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    })
student_ids = db.users.insert_many(students).inserted_ids

# 2️⃣ Create Instructors: 3 teachers
teachers = []
for _ in range(10):
    teachers.append({
        "name": fake.name(),
        "email": fake.unique.email(),
        "password": "$2a$10$demoHashedTeacherPassword",
        "role": "instructor",
        "enrolledCourses": [],
        "photoUrl": "",
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    })
teacher_ids = db.users.insert_many(teachers).inserted_ids

# 3️⃣ Create Courses + Lectures (7 courses, 1 lecture each)
course_titles = ['DBMS', 'DSA', 'Python', 'OOP', 'Maths', 'MongoDB', 'Java','CPP','Physics','Chemistry','AI','ML']
courses, lectures = [], []

for title in course_titles:
    lecture_id = ObjectId()
    lectures.append({
        "_id": lecture_id,
        "lectureTitle": f"Intro to {title}",
        "isPreviewFree": random.choice([True, False]),
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    })
    courses.append({
        "courseTitle": title,
        "category": title,
        "courseLevel": random.choice(["Beginner", "Medium", "Advanced"]),
        "coursePrice": random.choice([0, 99, 199]),
        "subTitle": f"Learn {title} from scratch",
        "description": f"<p>Master course on {title}</p>",
        "lectures": [lecture_id],
        "enrolledStudents": [],
        "creator": random.choice(teacher_ids),
        "isPublished": True,
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    })
lecture_ids = db.lectures.insert_many(lectures).inserted_ids
course_ids = db.courses.insert_many(courses).inserted_ids

# 4️⃣ Create Questions of All Types (120 total)
question_types = ["SingleCorrect", "MultiCorrect", "TrueFalse", "Integer", "ShortAnswer"]
questions = []

for _ in range(400):
    qtype = random.choice(question_types)
    options = [fake.word() for _ in range(random.randint(2, 4))]
    questions.append({
        "questionText": fake.sentence(nb_words=6),
        "options": options,
        "correctOptionIndex": 0 if qtype == "SingleCorrect" else None,
        "correctOptionIndexes": [0, 1] if qtype == "MultiCorrect" else [],
        "correctAnswer": str(random.randint(1, 100)) if qtype == "Integer" else None,
        "topic": random.choice(topics),
        "difficulty": random.choice(["Easy", "Medium", "Hard"]),
        "marks": random.choice([1, 2, 5]),
        "questionType": qtype,
        "isActive": True,
        "createdBy": random.choice(teacher_ids),
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    })
question_ids = db.questions.insert_many(questions).inserted_ids

# 5️⃣ Create Tests: 5 Topic Tests + 10 Mixed
tests = []

# Topic Tests
for i in range(40):
    tests.append({
        "testTitle": f"Topic Test {i+1}",
        "course": random.choice(course_ids),
        "testType": "Topic",
        "testLevel": "Beginner",
        "timeLimit": 30,
        "totalMarks": 10,
        "instructions": "<p>Attempt all questions</p>",
        "questions": random.sample(question_ids, 6),
        "isPublished": True,
        "startTime": datetime.now(),
        "endTime": datetime.now() + timedelta(days=3),
        "isScheduled": True,
        "createdBy": random.choice(teacher_ids),
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    })

# Mixed Tests
for i in range(50):
    tests.append({
        "testTitle": f"Mixed Test {i+1}",
        "course": None,
        "testType": "Mixed",
        "testLevel": "Medium",
        "timeLimit": 40,
        "totalMarks": 20,
        "instructions": "<p>Mixed topic test</p>",
        "questions": random.sample(question_ids, 8),
        "isPublished": True,
        "startTime": datetime.now(),
        "endTime": datetime.now() + timedelta(days=3),
        "isScheduled": True,
        "createdBy": random.choice(teacher_ids),
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    })
test_ids = db.tests.insert_many(tests).inserted_ids

# 6️⃣ Create Test Attempts: 700 total, all linked and scored
test_attempts = []
for _ in range(5000):
    student = random.choice(student_ids)
    test_obj = db.tests.find_one({"_id": random.choice(test_ids)})
    questions_in_test = test_obj["questions"]

    score = 0
    responses = []
    topic_scores = {}

    for q_id in questions_in_test:
        q = db.questions.find_one({"_id": q_id})
        correct = random.choice([True, False])
        awarded = q["marks"] if correct else 0
        score += awarded
        topic = q["topic"]
        topic_scores.setdefault(topic, []).append(awarded)

        responses.append({
            "question": q_id,
            "selectedOptionIndex": random.randint(0, len(q["options"]) - 1) if q["options"] else None,
            "isCorrect": correct,
            "topic": topic,
            "marksAwarded": awarded
        })

    topicWisePerformance = {k: round(sum(v)/len(v), 2) for k, v in topic_scores.items()}

    test_attempts.append({
        "student": student,
        "test": test_obj["_id"],
        "responses": responses,
        "totalMarks": test_obj["totalMarks"],
        "score": score,
        "status": "Submitted",
        "topicWisePerformance": topicWisePerformance,
        "avgQuestionDifficulty": round(random.uniform(1.0, 2.0), 1),
        "avgPreviousPerformance": round(random.uniform(30, 90), 2),
        "labelCourseId": random.choice(course_ids),
        "testType": test_obj["testType"],
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    })

if test_attempts:
    db.testattempts.insert_many(test_attempts)
    print(f"✅ {len(test_attempts)} test attempts inserted!")
else:
    print("❌ No test attempts to insert!")

print("✅ All collections populated successfully!")

# ------------------------ generate_seed_data.py ------------------------

# from faker import Faker
# import random
# from datetime import datetime, timedelta
# from pymongo import MongoClient
# from bson import ObjectId
# from dotenv import load_dotenv
# import os

# # STEP 1: Load environment variables from .env file
# load_dotenv()
# MONGO_URI = os.getenv("MONGO_URI")
# DB_NAME = os.getenv("DB_NAME")

# # STEP 2: Connect to MongoDB
# client = MongoClient(MONGO_URI)
# db = client[DB_NAME]

# # STEP 3: Initialize Faker instance
# fake = Faker()

# # STEP 4: Define topics pool
# topics = ['DBMS', 'DSA', 'Programming', 'Maths', 'OOP', 'Java']

# # STEP 5: Create 200 student users
# users = []
# for _ in range(200):
#     users.append({
#         "name": fake.name(),
#         "email": fake.unique.email(),
#         "password": "$2a$10$gUC0HlEuA8pSQCqDlQEnQO/KMjxV9/1lShrrZy1mj1FDX..QZol2K",
#         "role": "student",
#         "enrolledCourses": [],
#         "photoUrl": "",
#         "createdAt": datetime.now(),
#         "updatedAt": datetime.now()
#     })

# user_ids = db.users.insert_many(users).inserted_ids

# # STEP 6: Create 3 instructors
# instructors = []
# for _ in range(3):
#     instructors.append({
#         "name": fake.name(),
#         "email": fake.unique.email(),
#         "password": "hashed_password",
#         "role": "instructor",
#         "enrolledCourses": [],
#         "photoUrl": "",
#         "createdAt": datetime.now(),
#         "updatedAt": datetime.now()
#     })

# teacher_ids = db.users.insert_many(instructors).inserted_ids

# # STEP 7: Create 7 courses and lectures
# course_titles = ['DBMS', 'DSA', 'Python', 'OOP', 'Maths', 'MongoDB', 'Java']
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

#     courses.append({
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
#     })

# lecture_ids = db.lectures.insert_many(lectures).inserted_ids
# course_ids = db.courses.insert_many(courses).inserted_ids

# # STEP 8: Insert 90 questions (across all question types)
# questions = []
# question_types = ["SingleCorrect", "MultiCorrect", "TrueFalse", "Integer", "ShortAnswer"]

# for _ in range(90):
#     qtype = random.choice(question_types)
#     options = [fake.word() for _ in range(random.randint(2, 4))]

#     questions.append({
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
#     })

# question_ids = db.questions.insert_many(questions).inserted_ids

# # STEP 9: Insert 5 Topic Tests + 10 Mixed Tests
# tests = []

# # Topic tests
# for i in range(5):
#     selected_questions = random.sample(question_ids, 5)
#     tests.append({
#         "testTitle": f"Topic Test {i+1}",
#         "course": random.choice(course_ids),
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
#     })

# # Mixed tests
# for i in range(10):
#     selected_questions = random.sample(question_ids, 8)
#     tests.append({
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
#     })

# test_ids = db.tests.insert_many(tests).inserted_ids

# print(f"✅ Inserted {len(user_ids)} users, {len(teacher_ids)} instructors, {len(course_ids)} courses, {len(tests)} tests, and {len(question_ids)} questions.")