from pathlib import Path

from langchain_community.vectorstores import FAISS
from app.services.embeddings import embeddings


BASE_DIR = Path(__file__).resolve().parents[1]
VECTOR_ROOT = BASE_DIR / "uploads" / "vector_indexes"


def create_vector_store(chunks, index_id):

    vectors = FAISS.from_texts(
        chunks,
        embeddings
    )

    path = VECTOR_ROOT / str(index_id)
    path.mkdir(parents=True, exist_ok=True)

    vectors.save_local(str(path))

    return str(path)