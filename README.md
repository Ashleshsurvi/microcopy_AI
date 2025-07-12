📝 ***Microcopy Generator*** 📝

🎯 **Generate short microcopy variations using AI.**

This monorepo includes:

- 🟢 **Backend:** Django REST API with OpenAI integration (or dummy data)
- 🟣 **Frontend:** (React UI) *(Optional)*
- 🟡 **Chrome Extension:** Generate microcopy from any webpage

## 📂 Folder Structure

microcopy/
  backend/
  frontend/
  chromeextension/
  .gitignore
  README.md

## 🚀 Quick Start
Follow the steps below to get the project running locally.

🟢 **Backend Setup**

1️⃣ **Navigate to the backend folder: cd backend

2️⃣ Create a virtual environment
  python -m venv venv
  source venv/bin/activate

3️⃣ Install dependencies: pip install -r requirements.txt

4️⃣ Create .env file: OPENAI_API_KEY= "PLACE YOUR OPENAI API KEY HERE"

5️⃣ Run Django server: python manage.py runserver

NOTE:
1. The API will be available at: http://localhost:8000/api/generateMicrocopy/

2. Using Dummy Data (No API Cost) for testing :
   In views.py, set:  USE_DUMMY_DATA = True


🟣 **Frontend Setup**

1️⃣ Navigate to frontend: cd frontend
2️⃣ Install dependencies: npm install
3️⃣ Run development server: npm start or npm run dev


🟡 **Chrome Extension Setup**

1️⃣ Navigate to the Chrome extension folder: cd chromeextension

2️⃣ Edit config.js and set your backend URL:
  window.CONFIG = {
  BACKEND_URL: "http://localhost:8000", 
  };
  
3️⃣ Load in Chrome:
    Open chrome://extensions/
    Enable Developer Mode
    Click Load unpacked
    Select the chromeextension folder and you are all set.


✨ **Example API Request**

REQUEST:
POST /api/generateMicrocopy/:
{
  "text": "Sign up to get started",
  "tone": "Friendly"
}

RESPONSE:

{
  "alternatives": [
    "Join now to get started!",
    "Sign up today!",
    "Create your account now!",
    "Start your journey with us!",
    "Begin by signing up!"
  ]
}
