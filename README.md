# 🤖 Agentic AI Chatbot (LangChain + Gemini + FastAPI)

A **production-ready conversational AI chatbot** built using **LangChain**, **Google Gemini**, and **FastAPI**, featuring **session-based memory** and a **flashy, interactive web UI**.

This project demonstrates modern LLM orchestration using LangChain LCEL, stable Gemini models, and a full-stack implementation suitable for real-world deployment and interviews.

---

## ✨ Features

### 🔹 Backend
- LangChain (LCEL) with `RunnableWithMessageHistory`
- Google Gemini integration (`models/gemini-flash-latest`)
- FastAPI REST API
- Session-based conversational memory
- Clean and stable (no deprecated APIs)
- CORS enabled

### 🔹 Frontend
- Full-screen, app-like responsive interface
- Day/Night theme toggle with smooth CSS transitions
- Animated backgrounds (mesh blobs for day, starlight for night)
- Distinct chat bubbles for User and AI Agent
- Collapsible Agent Action / Tool Use blocks (terminal-style)
- Microphone with three states: Idle, Listening (pulse glow), Processing (spinner)
- Auto-expanding text input
- Markdown rendering with syntax-highlighted code blocks
- Voice input (Web Speech API)
- Message timestamps

---

## 🧠 Tech Stack

| Layer | Technology |
|------|-----------|
| LLM | Google Gemini |
| Orchestration | LangChain (LCEL) |
| Backend | FastAPI |
| Frontend | HTML, CSS, JavaScript |
| Memory | In-memory session-based |

---

## 📁 Project Structure

```
agentic-chatbot/
│
├── backend/
│   ├── main.py
│   ├── agent.py
│   ├── tools.py
│   ├── prompt.py
│   ├── requirements.txt
│   └── static/             ← Modern HTML/CSS/JS frontend
│       ├── index.html
│       ├── style.css
│       ├── script.js
│       └── marked.min.js
│
├── .env
└── README.md
```

---

## 🔐 Environment Setup

Create a `.env` file in the project root:

```
GEMINI_API_KEY=your_google_gemini_api_key
```

---

## 🚀 Backend Setup

Create virtual environment:

```
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```
pip install -r backend/requirements.txt
```

Run backend:

```
cd backend
uvicorn main:app --reload
```

Open API docs:

```
http://127.0.0.1:8000/docs
```

---

## 🌐 Frontend

The frontend is served as static files by the FastAPI backend.

Start the backend (see above), then open:

```
http://127.0.0.1:8000
```

The modern chat interface loads automatically from `backend/static/`.

---

## 🔌 API Contract

**POST /chat**

Request:
```
{
  "message": "Hello",
  "session_id": "frontend"
}
```

Response:
```
{
  "response": "Hello! How can I help you today?"
}
```

---

## 🧪 Model Used

```
models/gemini-flash-latest
```

Chosen for:
- Stability
- LangChain compatibility
- Speed and cost efficiency

---

## 🏆 Resume Description

Built a production-ready conversational AI chatbot using LangChain (LCEL), Google Gemini, and FastAPI with session-based memory and an interactive web UI.

---

## ☁️ Deploy to Render

### Option A — One-Click Blueprint

1. Push this repo to GitHub (if not already).
2. Go to [https://render.com](https://render.com) and sign up / log in.
3. Click **New → Blueprint** and connect your GitHub repo.
4. Render will detect `render.yaml` and set everything up automatically.
5. When prompted, add the `GEMINI_API_KEY` environment variable with your Google Gemini API key.
6. Click **Apply** — your service will build and deploy.

### Option B — Manual Web Service

1. Go to [https://render.com](https://render.com) and sign up / log in.
2. Click **New → Web Service** and connect your GitHub repo.
3. Configure the service:
   | Setting | Value |
   |---------|-------|
   | **Runtime** | Python |
   | **Build Command** | `pip install -r backend/requirements.txt` |
   | **Start Command** | `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT` |
4. Under **Environment → Environment Variables**, add:
   | Key | Value |
   |-----|-------|
   | `GEMINI_API_KEY` | *your Google Gemini API key* |
5. Click **Deploy Web Service**.

Once deployed, open your Render service URL to use the chatbot.

---

## 🚀 Future Enhancements

- PDF / document Q&A (RAG)
- LangChain tools (calculator, search)
- Streaming responses
- Persistent memory (database)
- Authentication & user sessions
- Docker deployment

---

## 📜 License

This project is intended for educational and portfolio use.

