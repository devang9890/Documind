from fastapi import APIRouter, HTTPException
from app.models.user_model import UserRegister, UserLogin
from app.core.auth_dependency import get_current_user
from fastapi import Depends
from app.db.mongodb import db
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter()


@router.post("/register")
async def register(user: UserRegister):

    existing = await db.users.find_one(
        {"email": user.email}
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password)
    }

    await db.users.insert_one(new_user)

    return {
        "message":"User registered successfully"
    }


@router.post("/login")
async def login(user: UserLogin):

    db_user = await db.users.find_one(
        {"email": user.email}
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(
        user.password,
        db_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {
            "sub": db_user["email"]
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/me")
async def get_me(
    current_user=Depends(get_current_user)
):
    return {
        "email": current_user["email"],
        "name": current_user["name"]
    }