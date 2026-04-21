from langchain_community.embeddings.fastembed import FastEmbedEmbeddings

def get_embeddings():
    # Using FastEmbed which doesn't require PyTorch, saving ~500MB of RAM
    return FastEmbedEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )