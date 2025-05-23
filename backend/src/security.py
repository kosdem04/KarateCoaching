from passlib.context import CryptContext
import datetime
from authlib.jose import jwt
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import HTTPException, Depends

SECRET_KEY = "super-secret-key"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: datetime.timedelta = datetime.timedelta(hours=5)):
    now = datetime.datetime.now(datetime.UTC)
    payload = {
        "exp": now + expires_delta,
        "iat": now,
        "sub": data["sub"],
    }
    return jwt.encode({"alg": ALGORITHM}, payload, SECRET_KEY).decode("utf-8")


security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        claims = jwt.decode(token, SECRET_KEY)
        claims.validate()  # проверяет срок жизни
        return claims["sub"]
    except Exception as e:
        print('Ошибка ', e)
        raise HTTPException( status_code=401, detail="Недействительный токен")



# async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
#     token = credentials.credentials
#     try:
#         claims = jwt.decode(token, SECRET_KEY)
#         claims.validate()
#         if claims.get("role") != "admin":
#             raise HTTPException(status_code=403, detail="Нет доступа")
#         return claims["sub"]
#     except Exception:
#         raise HTTPException(status_code=401, detail="Недействительный токен")