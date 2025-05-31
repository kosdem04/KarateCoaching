from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, desc, or_
from sqlalchemy.orm import selectinload, joinedload
from src.models.users import UserORM, UserRoleORM
from src.security import hash_password, verify_password
from fastapi import HTTPException
from starlette import status
from src.schemas.base import UserRegisterModel
import datetime


class AuthRequest:
    @classmethod
    async def register(cls, session: AsyncSession, user_data: UserRegisterModel):
        query = (
            select(UserORM)
            .where(UserORM.email == user_data.email)
        )
        user = await session.scalar(query)
        if not user:
            session.add(UserORM(
                first_name=user_data.first_name,
                patronymic=user_data.patronymic,
                last_name=user_data.last_name,
                email=user_data.email,
                password=hash_password(user_data.password),
                date_joined=datetime.datetime.now(datetime.UTC),
                img_url="https://s3.twcstorage.ru/414c6625-e8dd2907-0748-4c5c-8061-bbabd520cf1f/default-avatar.png",
            ))
            await session.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователь с таким email уже существует"
            )

    @classmethod
    async def authorization(cls, session: AsyncSession, email: str, password: str):
        query = select(UserORM).where(UserORM.email == email)
        user = await session.scalar(query)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный email пользователя",
            )
        elif not verify_password(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный пароль",
            )
        return user

    @classmethod
    async def get_user_data(cls, session: AsyncSession, user_id: int):
        query = (
            select(UserORM)
            .where(UserORM.id == user_id)
        )
        return await session.scalar(query)

    @classmethod
    async def get_user_roles(cls, session: AsyncSession, user_id: int):
        query = (
            select(UserRoleORM)
            .options(
                selectinload(UserRoleORM.role),
            )
            .where(UserRoleORM.user_id == user_id)
        )
        result_query = await session.execute(query)
        roles = result_query.scalars().all()
        return roles


