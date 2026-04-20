from fastapi import APIRouter, Depends, HTTPException

from pydantic import BaseModel

from app.core.auth_dependency import get_current_user

from app.services.rag_chain import ask_pdf

router = APIRouter()


class QuestionRequest(BaseModel):
    question: str


@router.post("/ask")
async def ask_question(
    body: QuestionRequest,
    current_user=Depends(get_current_user)
):

    try:
        answer = ask_pdf(
            body.question,
            str(current_user["_id"])
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        ) from exc

    return {
        "question": body.question,
        "answer": answer
    }