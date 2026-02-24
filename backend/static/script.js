/* ==========================================================================
   Agentic AI — Chat Application Logic
   Theme toggle, voice input (3 states), agent actions, auto-expanding textarea
   ========================================================================== */

const API_URL = "/chat";

const chat = document.getElementById("chat-container");
const textarea = document.getElementById("user-input");
const micBtn = document.getElementById("mic-btn");
const sendBtn = document.getElementById("send-btn");
const themeToggle = document.getElementById("theme-toggle");
const welcomeMsg = document.getElementById("welcome-msg");
const starsContainer = document.getElementById("stars");

/* ---------- MARKDOWN SETUP ---------- */
if (typeof marked !== "undefined") {
  marked.setOptions({ breaks: true, gfm: true });
}

/* ---------- STARS GENERATION (Night mode) ---------- */
function generateStars() {
  const count = 80;
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.setProperty("--duration", (2 + Math.random() * 4) + "s");
    star.style.setProperty("--brightness", (0.3 + Math.random() * 0.7).toFixed(2));
    star.style.animationDelay = (Math.random() * 5) + "s";
    starsContainer.appendChild(star);
  }
}
generateStars();

/* ---------- THEME TOGGLE ---------- */
let darkMode = false;

function toggleTheme() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark", darkMode);
}

themeToggle.addEventListener("change", toggleTheme);

/* ---------- HELPERS ---------- */
function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function renderMarkdown(text) {
  if (typeof marked !== "undefined") {
    return marked.parse(text);
  }
  return text.replace(/\n/g, "<br>");
}

function addCopyButtons(container) {
  container.querySelectorAll("pre").forEach((pre) => {
    const wrapper = document.createElement("div");
    wrapper.className = "code-block-wrapper";
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.onclick = () => {
      const code = pre.querySelector("code")
        ? pre.querySelector("code").textContent
        : pre.textContent;
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy"), 1500);
      });
    };
    wrapper.appendChild(btn);
  });
}

/* ---------- AUTO-EXPANDING TEXTAREA ---------- */
function autoResize() {
  textarea.style.height = "auto";
  textarea.style.height = Math.min(textarea.scrollHeight, 140) + "px";
}

textarea.addEventListener("input", autoResize);

textarea.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendBtn.addEventListener("click", sendMessage);

/* ---------- HIDE WELCOME ON FIRST MESSAGE ---------- */
function hideWelcome() {
  if (welcomeMsg) {
    welcomeMsg.style.display = "none";
  }
}

/* ---------- ADD MESSAGE ---------- */
function addMessage(text, sender) {
  hideWelcome();

  const msg = document.createElement("div");
  msg.className = `message ${sender}`;

  const label = document.createElement("div");
  label.className = "msg-label";
  label.textContent = sender === "user" ? "You" : "Agentic AI";

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  const time = document.createElement("div");
  time.className = "timestamp";
  time.textContent = timeNow();

  if (sender === "bot") {
    bubble.innerHTML = renderMarkdown(text);
    addCopyButtons(bubble);
  } else {
    bubble.textContent = text;
  }

  msg.appendChild(label);
  msg.appendChild(bubble);
  msg.appendChild(time);
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

/* ---------- AGENT ACTION BLOCK ---------- */
function createAgentAction(title, status) {
  hideWelcome();

  const action = document.createElement("div");
  action.className = "agent-action-skeleton";
  action.innerHTML = `
    <div class="skeleton-spinner"></div>
    <span class="skeleton-text">${escapeHTML(title)}</span>
  `;

  const wrapper = document.createElement("div");
  wrapper.className = "message bot";
  wrapper.style.maxWidth = "85%";
  wrapper.appendChild(action);
  chat.appendChild(wrapper);
  chat.scrollTop = chat.scrollHeight;

  return { wrapper, action };
}

function finalizeAgentAction(ref, title, body, status) {
  if (!ref) return;

  const { wrapper, action } = ref;

  const finalBlock = document.createElement("div");
  finalBlock.className = "agent-action";

  const header = document.createElement("div");
  header.className = "agent-action-header";
  header.innerHTML = `
    <span class="agent-action-icon">⚡</span>
    <span class="agent-action-title">${escapeHTML(title)}</span>
    <span class="agent-action-status">${escapeHTML(status || "Done")}</span>
    <span class="agent-action-chevron">▼</span>
  `;

  const bodyEl = document.createElement("div");
  bodyEl.className = "agent-action-body";
  bodyEl.textContent = body || "";

  header.addEventListener("click", () => {
    finalBlock.classList.toggle("expanded");
  });

  finalBlock.appendChild(header);
  finalBlock.appendChild(bodyEl);

  action.replaceWith(finalBlock);
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* ---------- THINKING INDICATOR ---------- */
function showThinking() {
  hideWelcome();

  const msg = document.createElement("div");
  msg.className = "message bot";
  msg.id = "thinking-indicator";

  const label = document.createElement("div");
  label.className = "msg-label";
  label.textContent = "Agentic AI";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = `<div class="thinking-dots"><span></span><span></span><span></span></div>`;

  msg.appendChild(label);
  msg.appendChild(bubble);
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;

  return msg;
}

function removeThinking(el) {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
}

/* ---------- SEND MESSAGE ---------- */
async function sendMessage() {
  const text = textarea.value.trim();
  if (!text) return;

  addMessage(text, "user");
  textarea.value = "";
  textarea.style.height = "auto";

  // Show agent action skeleton for tool use demo
  const agentRef = createAgentAction("Processing your request...", "working");

  const thinkingEl = showThinking();

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        session_id: "web",
      }),
    });

    removeThinking(thinkingEl);

    if (!res.ok) {
      finalizeAgentAction(agentRef, "Request Failed", "Server returned an error.", "Error");
      addMessage("⚠️ Server error. Try again.", "bot");
      return;
    }

    const data = await res.json();

    // Finalize agent action with response details
    const toolSteps = data.tool_steps;
    if (toolSteps && toolSteps.length > 0) {
      finalizeAgentAction(
        agentRef,
        `Used ${toolSteps.length} tool(s)`,
        toolSteps.map((s) => `→ ${s.tool}: ${s.input || ""}\n  Result: ${s.output || ""}`).join("\n\n"),
        "Completed"
      );
    } else {
      // No tools used — remove the skeleton
      if (agentRef && agentRef.wrapper && agentRef.wrapper.parentNode) {
        agentRef.wrapper.parentNode.removeChild(agentRef.wrapper);
      }
    }

    addMessage(data.response || "No response received.", "bot");
  } catch {
    removeThinking(thinkingEl);
    if (agentRef && agentRef.wrapper && agentRef.wrapper.parentNode) {
      agentRef.wrapper.parentNode.removeChild(agentRef.wrapper);
    }
    addMessage("⚠️ Could not reach server. Try again.", "bot");
  }
}

/* ---------- VOICE INPUT (3 states: idle / listening / processing) ---------- */
let recognition = null;
let micState = "idle"; // idle | listening | processing

function setMicState(state) {
  micState = state;
  micBtn.classList.remove("listening", "processing");

  if (state === "listening") {
    micBtn.classList.add("listening");
    micBtn.title = "Listening... Click to stop";
  } else if (state === "processing") {
    micBtn.classList.add("processing");
    micBtn.title = "Processing speech...";
  } else {
    micBtn.title = "Voice input";
  }
}

micBtn.addEventListener("click", () => {
  if (micState === "idle") {
    startVoice();
  } else if (micState === "listening") {
    stopVoice();
  }
  // If processing, do nothing (button is disabled via CSS pointer-events)
});

function startVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice input is not supported in this browser.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  setMicState("listening");
  recognition.start();

  recognition.onresult = (event) => {
    setMicState("processing");
    const transcript = event.results[0][0].transcript;

    // Brief processing animation then fill input
    setTimeout(() => {
      textarea.value = transcript;
      autoResize();
      setMicState("idle");
      sendMessage();
    }, 600);
  };

  recognition.onerror = (event) => {
    if (event.error === "not-allowed") {
      alert("Microphone access denied. Please allow microphone permissions.");
    }
    setMicState("idle");
  };

  recognition.onend = () => {
    if (micState === "listening") {
      setMicState("idle");
    }
  };
}

function stopVoice() {
  setMicState("idle");
  if (recognition) {
    recognition.abort();
    recognition = null;
  }
}
