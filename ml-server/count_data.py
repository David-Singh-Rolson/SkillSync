from pymongo import MongoClient
import os
from dotenv import load_dotenv


load_dotenv()
# Make sure your .env has MONGO_URI and DB_NAME
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

print("Users:", db.users.count_documents({}))
print("Courses:", db.courses.count_documents({}))
print("Lectures:", db.lectures.count_documents({}))
print("Questions:", db.questions.count_documents({}))
print("Tests:", db.tests.count_documents({}))
print("Test Attempts:", db.testattempts.count_documents({}))
