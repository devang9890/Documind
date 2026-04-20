from langchain_community.vectorstores import FAISS
from app.services.embeddings import embeddings


def create_vector_store(chunks, user_id):

    vectors = FAISS.from_texts(
        chunks,
        embeddings
    )

    path = f"app/vector_store/{user_id}"

    vectors.save_local(path)

    return path