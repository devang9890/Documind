from pathlib import Path

from groq import Groq

from langchain_community.vectorstores import FAISS

from app.services.embeddings import embeddings

from app.core.config import GROQ_API_KEY


client = Groq(
    api_key=GROQ_API_KEY
)

BASE_DIR = Path(__file__).resolve().parents[1]
VECTOR_ROOT = BASE_DIR / "uploads" / "vector_indexes"


def ask_pdf(question, user_id):

    # Load FAISS index

    user_index_dir = VECTOR_ROOT / str(user_id)

    if not (user_index_dir / "index.faiss").exists() or not (user_index_dir / "index.pkl").exists():
        raise ValueError("No processed PDF index found for this user. Upload a PDF first.")

    db = FAISS.load_local(
        str(user_index_dir),
        embeddings,
        allow_dangerous_deserialization=True
    )


    # Retrieve relevant chunks

    docs = db.similarity_search(
        question,
        k=4
    )


    context = "\n".join(
        [doc.page_content for doc in docs]
    )


    prompt = f"""
Use the context below to answer the question.

Context:
{context}

Question:
{question}

Answer:
"""


    response = client.chat.completions.create(

       model="llama-3.1-8b-instant",

        messages=[
            {
                "role":"user",
                "content": prompt
            }
        ],

        temperature=0
    )

    return response.choices[0].message.content