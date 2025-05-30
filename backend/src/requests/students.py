import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, desc, func, delete, asc
from sqlalchemy.orm import selectinload, joinedload, contains_eager
from src.models.groups import GroupORM
from src.models.students import StudentProfileORM
import src.schemas.base as base_schemas
from fastapi import HTTPException
from starlette import status
import src.schemas.students as students_schemas
from src.models.users import UserORM
from src.config import DEFAULT_AVATAR
from src.models.results import ResultORM, PlaceORM
from src.models.tournaments import EventORM
import src.schemas.results as results_schemas


class StudentRequest:
    @classmethod
    async def get_student_info(cls, session: AsyncSession, student_id: int):
        query = (
            select(StudentProfileORM)
            .options(
                selectinload(StudentProfileORM.student_data),
            )
            .where(StudentProfileORM.student_id == student_id)
        )
        result_query = await session.execute(query)
        result = result_query.scalar()
        student = students_schemas.StudentProfileModel.model_validate(result)
        return student

    @classmethod
    async def get_students_by_coach(cls, session: AsyncSession, coach_id: int):
        query = (
            select(StudentProfileORM)
            .options(
                selectinload(StudentProfileORM.student_data),
            )
            .where(StudentProfileORM.coach_id == coach_id)
        )
        result_query = await session.execute(query)
        results = result_query.scalars().all()
        students = [base_schemas.StudentModel.model_validate(r.student_data) for r in results]
        return students

    @classmethod
    async def add_student(cls, session, first_name: str, patronymic: str, last_name: str,
                            date_of_birth: datetime.date, avatar_url: str | None, coach_id: int):

        img_url = avatar_url or DEFAULT_AVATAR
        query = (
            select(UserORM)
            .options(
                selectinload(UserORM.student_profile),
            )
            .where(UserORM.first_name == first_name,
                   UserORM.patronymic == patronymic,
                   UserORM.last_name == last_name,
                   UserORM.date_of_birth == date_of_birth,
                   StudentProfileORM.coach_id == coach_id)
        )
        student = await session.scalar(query)
        if not student:
            new_user = UserORM(
                first_name=first_name,
                patronymic=patronymic,
                last_name=last_name,
                date_of_birth=date_of_birth,
                img_url=img_url,
            )
            session.add(new_user)
            await session.flush()  # получить ID до использования

            session.add(StudentProfileORM(
                student_id=new_user.id,
                coach_id=coach_id,
            ))
            await session.commit()
        elif not student.student_profile:
            session.add(StudentProfileORM(
                student_id=student.id,
                coach_id=coach_id,
            ))
            await session.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Такой ученик уже существует"
            )

    @classmethod
    async def update_student(cls, session: AsyncSession, first_name: str, patronymic: str, last_name: str,
                               date_of_birth: datetime.date, student_id: int):
        query = (
            update(UserORM)
            .where(UserORM.id == student_id)
            .values(first_name=first_name,
                    patronymic=patronymic,
                    last_name=last_name,
                    date_of_birth=date_of_birth,
                    )
        )
        await session.execute(query)
        await session.commit()

    @classmethod
    async def update_student_with_avatar(cls, session: AsyncSession, first_name: str, patronymic: str, last_name: str,
                                           date_of_birth: datetime.date, avatar_url: str, student_id: int):
        query = (
            update(UserORM)
            .where(UserORM.id == student_id)
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
    async def delete_student(cls, session: AsyncSession, student_id: int):
        query = (
            delete(UserORM)
            .where(UserORM.id == student_id)
        )
        await session.execute(query)
        await session.commit()

    @classmethod
    async def get_student_results(cls, session: AsyncSession, student_id: int):
        query = (
            select(ResultORM)
            .join(ResultORM.event)
            .options(
                selectinload(ResultORM.event),
                selectinload(ResultORM.place),
            )
            .where(ResultORM.student_id == student_id)
            .order_by(asc(EventORM.date_start))
        )
        result_query = await session.execute(query)
        results = result_query.unique().scalars().all()
        student_results = [students_schemas.StudentResultModel.model_validate(r) for r in results]
        return student_results