from fastapi import APIRouter, Depends, HTTPException

from pydantic import BaseModel
from bson import ObjectId

from app.core.auth_dependency import get_current_user
from app.db.mongodb import db

from app.services.rag_chain import ask_pdf

router = APIRouter()


class QuestionRequest(BaseModel):
    question: str
    document_id: str | None = None


@router.post("/ask")
async def ask_question(
    body: QuestionRequest,
    current_user=Depends(get_current_user)
):

    try:
        document = None

        if body.document_id:
            try:
                oid = ObjectId(body.document_id)
            except Exception as exc:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid document id"
                ) from exc

            document = await db.documents.find_one({
                "_id": oid,
                "user_id": str(current_user["_id"])
            })
        else:
            cursor = (
                db.documents
                .find({"user_id": str(current_user["_id"])})
                .sort("created_at", -1)
                .limit(1)
            )
            docs = await cursor.to_list(length=1)
            document = docs[0] if docs else None

        if not document:
            raise HTTPException(
                status_code=400,
                detail="No uploaded documents found. Upload a PDF first."
            )

        vector_path = document.get("vector_path")
        if not vector_path:
            raise HTTPException(
                status_code=400,
                detail="Selected document is not processed yet. Upload again."
            )

        answer = ask_pdf(body.question, vector_path)
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        ) from exc

    return {
        "question": body.question,
        "answer": answer
    }