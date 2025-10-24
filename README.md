# KnowPayScale (formerly BKL) - LinkedIn Salary Insights

A full-stack Chrome extension that provides **real-time salary estimates** directly on LinkedIn user profiles.  
This repository contains the complete project, separated into a **FastAPI backend** and a **React frontend**.

*(The original name, BKL, stands for “Beta Kitna Kama Lete Ho” 💸)*



---

## 🧩 Architecture

This project runs in two parts:

1. **`backend` (FastAPI Server)**  
   A secure middleware server written in Python.  
   Its job is to:
   - Receive requests from the extension  
   - Securely hold the Google Gemini API key  
   - Build a prompt and query the Gemini API  
   - Send back a clean JSON response  

2. **`Frontend` (React Client)**  
   The Chrome extension frontend.  
   It scrapes profile data (Job Title, Company, Location) from the LinkedIn page, sends it to the FastAPI backend, and displays the returned salary data in an injected React component.

**Data Flow:**  
`React Content Script` → `FastAPI Backend` → `Google Gemini API` → `FastAPI Backend` → `React Content Script`

---

## ⚙️ Tech Stack

### Backend (`backend/`)
- **Framework:** FastAPI  
- **Language:** Python 3.10+  
- **AI:** Google Gemini API (`google-generativeai`)  
- **Server:** Uvicorn  
- **Data Validation:** Pydantic  

### Frontend (`Frontend/`)
- **Library:** React 18  
- **State Management:** Redux Toolkit  
- **Bundler:** Vite  
- **Extension Framework:** CRXJS (Vite Plugin)  
- **Styling:** Plain CSS / Inline Styles  

---

## 🧰 Local Development Setup

To run this project, you must run **both the backend and frontend** simultaneously.

### Prerequisites
- Python 3.10+ and `pip`  
- Node.js v18+ and `npm`  
- A valid Google Gemini API Key  

---

### 🐍 Step 1: Run the Backend (FastAPI)

```bash
# 1. Navigate into the backend folder
cd backend

# 2. Create and activate a Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# 3. Install all required Python packages
pip install -r requirements.txt

# 4. Create an environment file to store secrets
touch .env

# 5. Add your API key to the .env file
# Open .env and add:
GEMINI_API_KEY="YOUR_SECRET_GEMINI_API_KEY_HERE"

# 6. Run the backend server
uvicorn app.main:app --reload
```

> The backend will now be running at:  
> **http://127.0.0.1:8000**

---

### ⚛️ Step 2: Run the Frontend (React)

Open a **new terminal** window and run:

```bash
# 1. Navigate into the frontend folder
cd frontend

# 2. Install all npm packages
npm install

# 3. Run the frontend development server
npm run dev
```

> This builds the extension into `frontend/dist`.

---

### 🧩 Step 3: Load the Extension in Chrome

1. Open Chrome and go to:  
   `chrome://extensions/`
2. Turn on **Developer mode** (toggle at the top-right).
3. Click **Load unpacked**.
4. Select the folder:  
   `frontend/dist`
5. The **DevWages** extension card will appear.

---

### 🔒 Step 4: Final Configuration (Fixing CORS)

You must allow your backend to accept requests from your new extension.

1. On your `chrome://extensions` page, copy your extension’s **ID**.
2. Open the backend file:  
   `backend/app/main.py`
3. Find the `CORSMiddleware` section and edit it like this:

```python
# bkl-backend/app/main.py

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "chrome-extension://YOUR_EXTENSION_ID_PASTE_HERE",  # Add your extension ID
        "https://www.linkedin.com"  # Allow LinkedIn
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

4. Save the file. FastAPI will auto-restart.
5. Go back to `chrome://extensions` and click the **Reload** icon on the card.

---

## 🎉 All Set!

Your setup is complete!  
Now visit any **LinkedIn profile** (e.g., `https://www.linkedin.com/in/...`) and watch **BKL** display real-time salary insights directly on the page.

---

### 📄 License
This project is licensed under the **MIT License**.

---

### 💡 Author
**KnowPayScale Team**  
Built with ❤️ using FastAPI + React.
