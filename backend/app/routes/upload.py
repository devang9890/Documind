import os

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException

from app.db.mongodb import db
from app.core.auth_dependency import get_current_user
from app.services.pdf_parser import extract_text_from_pdf
from app.services.chunking import chunk_text
from app.services.vector_store import create_vector_store

router = APIRouter()

UPLOAD_DIR = "app/uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    text = extract_text_from_pdf(file_path)

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="Uploaded PDF has no extractable text"
        )

    chunks = chunk_text(text)

    if not chunks:
        raise HTTPException(
            status_code=400,
            detail="Could not create chunks from PDF"
        )

    vector_path = create_vector_store(
        chunks,
        str(current_user["_id"])
    )

    await db.documents.insert_one({
        "filename": file.filename,
        "path": file_path,
        "user_id": str(current_user["_id"]),
        "vector_path": vector_path
    })

    return {
        "message":"PDF uploaded successfully"
    }