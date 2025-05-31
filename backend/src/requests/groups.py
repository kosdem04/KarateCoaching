from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, desc, func, delete
from sqlalchemy.orm import selectinload, joinedload, contains_eager
from src.models.groups import GroupORM
from src.models.students import StudentProfileORM
from fastapi import HTTPException
from starlette import status


class GroupRequest:
    @classmethod
    async def get_group_info(cls, session: AsyncSession, group_id: int):
        query = (
            select(GroupORM)
            .where(GroupORM.id == group_id)
        )
        result_query = await session.execute(query)
        result = result_query.scalar()
        return result

    @classmethod
    async def add_group(cls, session, name: str, coach_id):
        query = (
            select(GroupORM)
            .where(GroupORM.name == name,
                   GroupORM.coach_id == coach_id)
        )
        group = await session.scalar(query)
        if not group:
            session.add(GroupORM(
                name=name,
                coach_id=coach_id,
            ))
            await session.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Такая группа уже есть"
            )

    @classmethod
    async def update_group(cls, session: AsyncSession, name: str, group_id: int):
        query = (
            update(GroupORM)
            .where(GroupORM.id == group_id)
            .values(
                name=name,
            )
        )
        await session.execute(query)
        await session.commit()

    @classmethod
    async def delete_group(cls, session: AsyncSession, group_id: int):
        query = (
            delete(GroupORM)
            .where(GroupORM.id == group_id)
        )
        await session.execute(query)
        await session.commit()

    @classmethod
    async def add_student_in_group(cls, session, group_id, student_id):
        query = (
            select(StudentProfileORM)
            .where(StudentProfileORM.student_id == student_id)
        )
        student_in_group = await session.scalar(query)
        if not student_in_group:
            session.add(GroupORM(
                name=data.name,
                coach_id=user_id,
            ))
            await session.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Такая группа уже есть"
            )