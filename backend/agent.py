import os
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory

load_dotenv()

# ---------------- LLM ----------------
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.4,
)

# ---------------- PROMPT ----------------
SYSTEM_PROMPT = """
You are a helpful, intelligent AI assistant.
Answer clearly and concisely.
Maintain conversational context.
"""

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", SYSTEM_PROMPT),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}")
    ]
)

# Chain = Prompt → LLM
chain = prompt | llm

# ---------------- MEMORY ----------------
_store = {}

def get_session_history(session_id: str):
    if session_id not in _store:
        _store[session_id] = ChatMessageHistory()
    return _store[session_id]

chatbot = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history",
)

# ---------------- RUN FUNCTION ----------------
def run_agent(message: str, session_id: str = "default") -> str:
    result = chatbot.invoke(
        {"input": message},
        config={"configurable": {"session_id": session_id}},
    )
    return result.content

