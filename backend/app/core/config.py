import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

MONGO_URI = os.getenv("MONGO_URI")

DATABASE_NAME = os.getenv("DATABASE_NAME")

JWT_SECRET = os.getenv("JWT_SECRET")