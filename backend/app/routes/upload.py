import os
import shutil
from datetime import datetime

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from bson import ObjectId

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

    document_id = ObjectId()

    stored_filename = f"{document_id}_{file.filename}"

    file_path = os.path.join(
        UPLOAD_DIR,
        stored_filename
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
        str(document_id)
    )

    await db.documents.insert_one({
        "_id": document_id,
        "filename": file.filename,
        "stored_filename": stored_filename,
        "path": file_path,
        "user_id": str(current_user["_id"]),
        "vector_path": vector_path,
        "created_at": datetime.utcnow()
    })

    return {
        "message":"PDF uploaded successfully",
        "document": {
            "id": str(document_id),
            "filename": file.filename
        }
    }


@router.get("/documents")
async def list_documents(
    q: str | None = None,
    current_user=Depends(get_current_user)
):

    query: dict = {
        "user_id": str(current_user["_id"])
    }

    if q:
        query["filename"] = {
            "$regex": q,
            "$options": "i"
        }

    cursor = db.documents.find(query).sort("created_at", -1)
    docs = await cursor.to_list(length=200)

    return {
        "documents": [
            {
                "id": str(doc["_id"]),
                "filename": doc.get("filename"),
                "created_at": doc.get("created_at"),
            }
            for doc in docs
        ]
    }


@router.delete("/documents/{document_id}")
async def delete_document(
    document_id: str,
    current_user=Depends(get_current_user)
):

    try:
        oid = ObjectId(document_id)
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail="Invalid document id"
        ) from exc

    doc = await db.documents.find_one({
        "_id": oid,
        "user_id": str(current_user["_id"])
    })

    if not doc:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    await db.documents.delete_one({
        "_id": oid,
        "user_id": str(current_user["_id"])
    })

    file_path = doc.get("path")
    if file_path and os.path.exists(file_path):
        try:
            os.remove(file_path)
        except OSError:
            pass

    vector_path = doc.get("vector_path")
    if vector_path and os.path.exists(vector_path):
        try:
            shutil.rmtree(vector_path)
        except OSError:
            pass

    return {
        "message": "Document deleted"
    }