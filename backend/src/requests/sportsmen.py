import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, desc, func, delete
from sqlalchemy.orm import selectinload, joinedload, contains_eager
from src.models.sportsmen import SportsmanORM
# import src.schemas.sportsmen as sportsmen_schemas
from fastapi import HTTPException
from starlette import status
import src.schemas.sportsmen as sportsmen_schemas


class SportsmanRequest:
    @classmethod
    async def get_sportsmen_by_coach(cls, session:AsyncSession, user_id: int):
        query = (
            select(SportsmanORM)
            .where(SportsmanORM.coach_id == user_id)
        )
        result_query = await session.execute(query)
        results = result_query.scalars().all()
        sportsmen = [sportsmen_schemas.SportsmanSimpleModel.model_validate(r) for r in results]
        return sportsmen


    @classmethod
    async def get_sportsman(cls, session: AsyncSession, sportsman_id: int):
        query = (
            select(SportsmanORM)
            .where(SportsmanORM.id == sportsman_id)
        )
        result = await session.scalar(query)
        sportsman = sportsmen_schemas.SportsmanSimpleModel.model_validate(result)
        return sportsman

    @classmethod
    async def add_sportsman(cls, session, first_name: str, patronymic: str, last_name: str,
            date_of_birth: datetime.datetime, avatar_url: str | None, user_id: int):
        DEFAULT_AVATAR = "https://s3.twcstorage.ru/414c6625-e8dd2907-0748-4c5c-8061-bbabd520cf1f/default-avatar.png"
        img_url = avatar_url or DEFAULT_AVATAR
        query = (
                select(SportsmanORM)
                .where(SportsmanORM.first_name == first_name,
                       SportsmanORM.patronymic == patronymic,
                       SportsmanORM.last_name == last_name,
                       SportsmanORM.date_of_birth == date_of_birth,
                       SportsmanORM.coach_id == user_id)
            )
        sportsman = await session.scalar(query)
        if not sportsman:
            session.add(SportsmanORM(
                first_name=first_name,
                patronymic=patronymic,
                last_name=last_name,
                date_of_birth=date_of_birth,
                img_url=img_url,
                coach_id=user_id,
            ))
            await session.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Такой спортсмен уже существует"
            )

    @classmethod
    async def update_sportsmen(cls, session: AsyncSession, first_name: str, patronymic: str, last_name: str,
            date_of_birth: datetime.datetime, sportsman_id: int):
        query = (
            update(SportsmanORM)
            .where(SportsmanORM.id == sportsman_id)
            .values(first_name=first_name,
                    patronymic=patronymic,
                    last_name=last_name,
                    date_of_birth=date_of_birth,
                   )
        )
        await session.execute(query)
        await session.commit()

    @classmethod
    async def update_sportsmen_with_avatar(cls, session: AsyncSession, first_name: str, patronymic: str, last_name: str,
                               date_of_birth: datetime.datetime, avatar_url: str, sportsman_id: int):
        query = (
            update(SportsmanORM)
            .where(SportsmanORM.id == sportsman_id)
            .values(first_name=first_name,
                    patronymic=patronymic,
                    last_name=last_name,
                    date_of_birth=date_of_birth,
                    img_url=avatar_url,
                    )
        )
        await session.execute(query)
        await session.commit()

    @classmethod
    async def delete_sportsman(cls, session: AsyncSession, sportsman_id: int):
        query = (
            delete(SportsmanORM)
            .where(SportsmanORM.id == sportsman_id)
        )
        await session.execute(query)
        await session.commit()


