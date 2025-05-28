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


class StudentRequest:
    @classmethod
    async def get_student_info(cls, session: AsyncSession, student_id: int):
        query = (
            select(StudentProfileORM)
            .options(
                selectinload(StudentProfileORM.student),
            )
            .where(StudentProfileORM.student_id == student_id)
        )
        result_query = await session.execute(query)
        results = result_query.scalar()
        # sportsmen = [sportsmen_schemas.SportsmanSimpleModel.model_validate(r) for r in results]
        return results