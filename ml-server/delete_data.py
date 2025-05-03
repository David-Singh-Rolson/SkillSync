from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

db.users.delete_many({})
db.courses.delete_many({})
db.lectures.delete_many({})
db.questions.delete_many({})
db.tests.delete_many({})
db.testattempts.delete_many({})

print("All data deleted from users, courses, lectures, questions, tests, and testattempts.")
