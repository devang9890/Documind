# DocuMind AI

**DocuMind AI** is an AI-powered study assistant built for students. It allows you to upload lecture slides, PDF notes, or textbooks, and instantly chat with them using Retrieval-Augmented Generation (RAG). Say goodbye to mindless scrolling—ask questions, generate summarizations, or even request practice quizzes directly from your notes.

---

## ✨ Features

- **Document Chat:** Upload PDFs and immediately start a conversation contextually grounded to those specific documents.
- **Student-First Interface:** Elegant, distraction-free Dark Mode UI specifically designed for long study sessions.
- **Smart Suggestions:** Automated prompt chips like "Create quiz from notes" or "Explain in simple words" designed to speed up your learning workflow.
- **ChatGPT-Style Layout:** A familiar intuitive messaging system with full Markdown support, auto-scrolling, and a fixed input bar.
- **Fully Responsive:** Use it seamlessly on laptops, tablets, or smartphones.

## 🛠️ Tech Stack

**Frontend:**
- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [React Markdown](https://github.com/remarkjs/react-markdown) & [Lucide Icons](https://lucide.dev/)

**Backend:**
- [FastAPI](https://fastapi.tiangolo.com/) (Python)
- SQLite / Vector Database for RAG
- AI integration for intelligent text generation

---

## 🚀 Getting Started

### 1. Run the Backend
Navigate to the `backend` directory, install requirements, and run the server.
```bash
cd backend
python -m venv venv
# Activate the venv (Windows: venv\Scripts\activate, Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
*Backend runs locally on `http://localhost:8000`*

### 2. Run the Frontend
Navigate to the `frontend` directory, install dependencies, and start the development server.
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs locally on `http://localhost:5173`*

---

> **Note:** Make sure you have your necessary API keys (like Groq/OpenAI base keys) correctly configured inside the backend's `.env` file for the AI processing to work effectively.
