from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from app.core.config import JWT_SECRET
from app.db.mongodb import db

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"]
        )

        email = payload.get("sub")

        user = await db.users.find_one(
            {"email": email}
        )

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid user"
            )

        return user

    except:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )