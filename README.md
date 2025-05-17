# SkillSync
# 🎓 SkillSync LMS — AI-Powered Learning Platform

SkillSync is a modern AI-integrated Learning Management System (LMS) designed to revolutionize how students interact with courses, tests, and their learning journey.

> 🔍 **Highlight**: Our smart recommendation engine suggests the most beneficial courses based on students' performance and test behavior — achieving up to **85% accuracy**.

---

## 🚀 Features

- 👨‍🎓 Student and 👩‍🏫 Teacher roles with full learning flow
- 📚 Course creation, enrollment, and test attempt system
- 📊 Topic-wise performance analytics and ML-based course recommendation
- 🧠 Machine Learning engine with 85% accuracy in course guidance
- 📈 Dashboard for tracking performance over time
- ☁️ Firebase / MongoDB cloud integration
- 🧪 Admin (SuperAdmin) Panel (separately managed)
- 🌙 Dark mode, animations, clean UI

---

## 🧠 Recommendation System (ML-Integrated)

> SkillSync uses decision trees and performance analytics to understand:
- Time taken per question
- Topic-wise accuracy
- Level of questions attempted
- Dropout/fatigue trends

It then recommends the most relevant next course(s) using a trained ML model with ~85% prediction accuracy, constantly improving as more test data is submitted.

---

## 🛠 Tech Stack

- ⚛️ React + Tailwind CSS (Frontend)
- 🟩 Node.js + Express.js (Backend)
- 🍃 MongoDB Atlas (Database)
- 🧠 Python + Scikit-learn (ML Model)
- ☁️ Firebase (Media, Auth optional)
- 📊 Recharts.js for analytics

---

## 🔧 Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/David-Singh-Rolson/SkillSync.git
cd SkillSync
```

### 2. Environment Setup
Create a .env file in /server:
```
PORT=5000
MONGO_URI=your_mongodb_uri
SECRET_KEY=your_jwt_secret
```
Create a .env file in /ml-server:
```
ini
Copy
Edit
PYTHON_ENV=development
```
### 3. Backend Setup (Node.js + Express)
```bash
cd server
npm install
npm start
API will run at: http://localhost:5000
```
### 4. Frontend Setup (React + Vite)
```bash
cd client
npm install
npm run dev
UI will run at: http://localhost:5173
```
### 5. ML Server Setup (Python API)
```
cd ml-server
pip install -r requirements.txt
python ml_api.py
ML API runs at: http://localhost:5001 (or your configured port)
```
### 6. Populate Database with Test Data (Optional)
```bash
cd ml-server
python generate_seed_data.py   # One-time setup
python generate_testAttempt.py # Repeatable test attempt generation
```
## 📁 Folder Structure
```bash
SkillSync/
├── client/       # Frontend (React)
├── server/       # Backend (Node + Express)
├── ml-server/    # Machine Learning Engine (Python)
```