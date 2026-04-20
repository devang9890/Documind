import os

from fastapi import APIRouter, UploadFile, File, Depends

from app.db.mongodb import db
from app.core.auth_dependency import get_current_user

router = APIRouter()

UPLOAD_DIR = "app/uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    await db.documents.insert_one({
        "filename": file.filename,
        "path": file_path,
        "user_id": str(current_user["_id"])
    })

    return {
        "message":"PDF uploaded successfully"
    }