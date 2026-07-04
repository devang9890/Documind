import time
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
    print("Request Started: User Registration")
    start_total = time.perf_counter()

    start_db = time.perf_counter()
    existing = await db.users.find_one(
        {"email": user.email}
    )
    db_time = (time.perf_counter() - start_db) * 1000

    if existing:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    start_hash = time.perf_counter()
    hashed = await hash_password(user.password)
    hash_time = (time.perf_counter() - start_hash) * 1000

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed
    }

    start_insert = time.perf_counter()
    await db.users.insert_one(new_user)
    insert_time = (time.perf_counter() - start_insert) * 1000

    total_time = (time.perf_counter() - start_total) * 1000
    print(f"Database Query (check existing): {db_time:.2f}ms")
    print(f"Password Hash: {hash_time:.2f}ms")
    print(f"Database Insert: {insert_time:.2f}ms")
    print(f"Total Registration Time: {total_time:.2f}ms")

    return {
        "message":"User registered successfully"
    }


@router.post("/login")
async def login(user: UserLogin):
    print("Request Started: User Login")
    start_total = time.perf_counter()

    start_db = time.perf_counter()
    db_user = await db.users.find_one(
        {"email": user.email}
    )
    db_time = (time.perf_counter() - start_db) * 1000

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    start_hash = time.perf_counter()
    is_valid = await verify_password(
        user.password,
        db_user["password"]
    )
    hash_time = (time.perf_counter() - start_hash) * 1000

    if not is_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    start_jwt = time.perf_counter()
    token = create_access_token(
        {
            "sub": db_user["email"]
        }
    )
    jwt_time = (time.perf_counter() - start_jwt) * 1000

    total_time = (time.perf_counter() - start_total) * 1000
    print(f"Database Query: {db_time:.2f}ms")
    print(f"Password Hash Verify: {hash_time:.2f}ms")
    print(f"JWT Generation: {jwt_time:.2f}ms")
    print(f"Total Login Time: {total_time:.2f}ms")

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