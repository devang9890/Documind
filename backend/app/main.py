from fastapi import FastAPI

from app.routes.auth import router as auth_router
from app.routes.upload import router as upload_router

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

@app.get("/")
def home():
    return {
        "message":"DocuMind AI Running"
    }