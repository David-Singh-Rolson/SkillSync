from faker import Faker
import random
import json
from pymongo import MongoClient
from datetime import datetime

# Initialize Faker
fake = Faker()

# MongoDB connection
client = MongoClient("mongodb+srv://davidsinghrolson:l0kjL6nobVBEGKkB@cluster0.ruleu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["test"]  # 🔥 Change this to your real database name
collection = db.testattempts

# List of fake topics
topics = ['DBMS', 'DSA', 'Programming']

# Function to generate a fake test attempt document
def generate_fake_attempt():
    attempt = {
        "student": fake.uuid4(),
        "test": fake.uuid4(),
        "responses": [fake.text(max_nb_chars=100) for _ in range(5)],
        "totalMarks": random.randint(5, 20),
        "score": random.randint(0, 5),
        "status": "Submitted",
        "topicWisePerformance": {topic: random.uniform(0, 5) for topic in topics},
        "avgQuestionDifficulty": round(random.uniform(1, 2), 1),
        "avgPreviousPerformance": str(random.randint(10, 100)),
        "labelCourseId": fake.uuid4(),
        "testType": random.choice(["Topic", "Mixed"]),
        "createdAt": datetime.now(),  # Use datetime.now() instead of fake.date_this_year()
        "updatedAt": datetime.now(),  # Use datetime.now() instead of fake.date_this_year()
    }
    return attempt

# Generate and insert 10 fake records
fake_data = [generate_fake_attempt() for _ in range(10)]

# Insert data into MongoDB
collection.insert_many(fake_data)

print(f"✅ {len(fake_data)} fake records inserted into MongoDB!")
