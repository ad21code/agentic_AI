from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from agent import run_agent

# ---------------- APP INIT ----------------
app = FastAPI(
    title="Agentic AI Chatbot",
    description="LangChain + Gemini powered AI chatbot",
    version="1.0.0"
)

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # OK for demo; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- STATIC FILES ----------------
app.mount("/static", StaticFiles(directory="static"), name="static")

# ---------------- MODELS ----------------
class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

# ---------------- ROUTES ----------------
@app.get("/")
def serve_frontend():
    """
    Serve the chatbot UI
    """
    return FileResponse("static/index.html")

@app.post("/chat", operation_id="chat_endpoint")
def chat(req: ChatRequest):
    """
    Chat endpoint for frontend & API clients
    """
    try:
        response = run_agent(req.message, req.session_id)
        return {"response": response}
    except Exception as e:
        return {"response": f"⚠️ Error: {str(e)}"}

@app.get("/health")
def health_check():
    """
    Health check for Render / monitoring
    """
    return {"status": "ok"}
