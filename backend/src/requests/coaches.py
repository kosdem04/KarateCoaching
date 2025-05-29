import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, desc, func, delete
from sqlalchemy.orm import selectinload, joinedload, contains_eager
from src.models.groups import GroupORM
from src.models.sportsmen import StudentProfileORM
# import src.schemas.sportsmen as sportsmen_schemas
from fastapi import HTTPException
from starlette import status
import src.schemas.sportsmen as sportsmen_schemas


class CoachRequest:
    @classmethod
    async def get_coach_groups(cls, session: AsyncSession, user_id: int):
        query = (
            select(GroupORM)
            .where(GroupORM.coach_id == user_id)
        )
        result_query = await session.execute(query)
        results = result_query.scalars().all()
        # sportsmen = [sportsmen_schemas.SportsmanSimpleModel.model_validate(r) for r in results]
        return results

    @classmethod
    async def get_students_in_group(cls, session: AsyncSession, group_id: int):
        query = (
            select(StudentProfileORM)
            .options(
                selectinload(StudentProfileORM.student_data),
            )
            .where(StudentProfileORM.group_id == group_id)
        )
        result_query = await session.execute(query)
        results = result_query.scalars().all()
        # sportsmen = [sportsmen_schemas.SportsmanSimpleModel.model_validate(r) for r in results]
        return results