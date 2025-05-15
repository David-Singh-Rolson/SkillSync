
import os
import random
from faker import Faker
from datetime import datetime
from dotenv import load_dotenv
from pymongo import MongoClient

fake = Faker()
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# 🧹 Wipe all
# for col in ["users", "courses", "lectures", "questions", "tests", "testattempts"]:
#     db[col].delete_many({})

# 👤 Users
students, teachers = [], []
for _ in range(10):
    teachers.append({
        "name": fake.name(),
        "email": fake.unique.email(),
        "role": "instructor",
        "password": "hashed"
    })

for _ in range(50):
    students.append({
        "name": fake.name(),
        "email": fake.unique.email(),
        "role": "student",
        "password": "hashed"
    })

teacher_ids = db.users.insert_many(teachers).inserted_ids
student_ids = db.users.insert_many(students).inserted_ids

# 📚 Courses
courses = []
for _ in range(5):
    courses.append({
        "title": f"{fake.word().capitalize()} Mastery",
        "description": fake.text(),
        "category": fake.word(),
        "instructor": random.choice(teacher_ids)
    })

course_ids = db.courses.insert_many(courses).inserted_ids

# 🎥 Lectures
lectures = []
for cid in course_ids:
    for _ in range(random.randint(3, 6)):
        lectures.append({
            "course": cid,
            "title": fake.sentence(),
            "videoUrl": fake.url(),
            "description": fake.text()
        })
db.lectures.insert_many(lectures)

# ❓ Questions + Tests
questions = []
tests = []
test_to_course = {}

for cid in course_ids:
    test_question_ids = []
    for _ in range(10):
        q = {
            "course": cid,
            "question": fake.sentence(),
            "options": [fake.word() for _ in range(4)],
            "correctOptionIndex": 0,
            "difficulty": random.choice(["Easy", "Medium", "Hard"]),
            "topic": random.choice(["DBMS", "OS", "CN", "DSA"]),
            "marks": 5
        }
        q_id = db.questions.insert_one(q).inserted_id
        questions.append(q_id)
        test_question_ids.append(q_id)

    # Create 2 tests per course
    for _ in range(2):
        selected_qs = random.sample(test_question_ids, 5)
        test = {
            "title": fake.word().capitalize() + " Test",
            "course": cid,
            "questions": selected_qs,
            "type": random.choice(["Topic", "Mixed"]),
            "duration": random.choice([15, 30, 45])
        }
        tid = db.tests.insert_one(test).inserted_id
        tests.append((tid, cid))

# 🧠 Attempts
difficulty_map = {"Easy": "easy", "Medium": "medium", "Hard": "hard"}
q_map = {str(q["_id"]): q for q in db.questions.find({})}
attempts = []

for sid in student_ids:
    selected_tests = random.sample(tests, 2)
    for tid, cid in selected_tests:
        test = db.tests.find_one({"_id": tid})
        qids = test["questions"]
        responses = []
        topic_perf, topic_marks = {}, {}
        q_stats = {"easy": {"attempted": 0, "correct": 0},
                   "medium": {"attempted": 0, "correct": 0},
                   "hard": {"attempted": 0, "correct": 0}}
        total_score, total_marks, total_diff = 0, 0, 0

        for qid in qids:
            q = q_map.get(str(qid))
            if not q: continue
            correct = random.choice([True, False])
            marks = q["marks"]
            topic = q["topic"]
            level = q["difficulty"]
            diff_val = {"Easy": 1, "Medium": 2, "Hard": 3}[level]
            response = {
                "question": qid,
                "isCorrect": correct,
                "topic": topic,
                "quesLevel": level,
                "marksAwarded": marks if correct else 0,
                "selectedOptionIndex": 0
            }
            responses.append(response)
            total_score += marks if correct else 0
            total_marks += marks
            total_diff += diff_val

            key = difficulty_map[level]
            q_stats[key]["attempted"] += 1
            if correct:
                q_stats[key]["correct"] += 1

            topic_perf[topic] = topic_perf.get(topic, 0) + (marks if correct else 0)
            topic_marks[topic] = topic_marks.get(topic, 0) + marks

        # Calculate accuracy & topic %
        for lvl in q_stats:
            att = q_stats[lvl]["attempted"]
            cor = q_stats[lvl]["correct"]
            q_stats[lvl]["accuracy"] = round(cor / att, 2) if att > 0 else 0

        topicWisePerformance = {
            topic: round((topic_perf[topic] / topic_marks[topic]) * 100)
            for topic in topic_perf
        }

        attempt = {
            "student": sid,
            "test": tid,
            "responses": responses,
            "totalMarks": total_marks,
            "score": total_score,
            "avgTopicDifficulty": round(total_diff / 5, 2),
            "overallAccuracy": round(total_score / total_marks, 2),
            "percentage": round((total_score / total_marks) * 100, 2),
            "status": "Submitted",
            "timeTaken": random.randint(300, 1000),
            "questionLevelStats": q_stats,
            "topicWisePerformance": topicWisePerformance,
            "avgQuestionDifficulty": round(total_diff / 5, 2),
            "avgPreviousPerformance": round(random.uniform(30, 90), 2),
            "labelCourseId": cid,
            "testType": test["type"],
            "testLevel": random.choice(["Beginner", "Medium", "Advance"]),
            "performanceTrend": random.choice(["Improving", "Declining", "Stable"]),
            "remarks": fake.sentence(),
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }

        attempts.append(attempt)

if attempts:
    db.testattempts.insert_many(attempts)
    print(f"\n✅ Successfully seeded full database with:")
    print(f"   👤 Students: {len(student_ids)}")
    print(f"   🧑‍🏫 Instructors: {len(teacher_ids)}")
    print(f"   📚 Courses: {len(course_ids)}")
    print(f"   🧪 Tests: {len(tests)}")
    print(f"   ❓ Questions: {len(questions)}")
    print(f"   🧠 Test Attempts: {len(attempts)}")
else:
    print("❌ No test attempts inserted.")
