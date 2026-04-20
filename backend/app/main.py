from fastapi import FastAPI

from app.routes.auth import router as auth_router
from app.routes.upload import router as upload_router
from app.routes.chat import router as chat_router

app = FastAPI()

# Auth routes
app.include_router(
    auth_router,
    prefix="/api/auth",
    tags=["Authentication"]
)

# Upload routes
app.include_router(
    upload_router,
    prefix="/api/upload",
    tags=["Upload"]
)
app.include_router(
    chat_router,
    prefix="/api/chat",
    tags=["Chat"]
)

@app.get("/")
def home():
    return {
        "message":"DocuMind AI Running"
    }