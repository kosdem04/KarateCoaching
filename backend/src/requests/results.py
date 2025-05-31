from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, desc, delete, asc
from sqlalchemy.orm import selectinload, joinedload

from src.models.results import ResultORM, PlaceORM
from fastapi import HTTPException
from starlette import status
from src.models.students import StudentProfileORM
from src.models.events import EventORM


class ResultRequest:
    @classmethod
    async def add_result(cls,
                         session,
                         event_id: int,
                         student_id: int,
                         place_id: int,
                         points_scored: int,
                         points_missed: int,
                         number_of_fights: int):
        query = (
            select(ResultORM)
            .where(ResultORM.event_id == event_id,
                   ResultORM.student_id == student_id,
                   ResultORM.place_id == place_id,
                   ResultORM.points_scored == points_scored,
                   ResultORM.points_missed == points_missed,
                   ResultORM.number_of_fights == number_of_fights,
                   )
        )
        result = await session.scalar(query)
        if not result:
            session.add(ResultORM(
                event_id=event_id,
                student_id=student_id,
                place_id=place_id,
                points_scored=points_scored,
                points_missed=points_missed,
                number_of_fights=number_of_fights,
                average_score=points_scored / number_of_fights,
                efficiency=(points_scored - points_missed) / number_of_fights,
            ))
            await session.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Такой результат уже есть"
            )

    @classmethod
    async def get_places(cls, session: AsyncSession):
        query = (
            select(PlaceORM)
        )
        result_query = await session.execute(query)
        results = result_query.scalars().all()
        return results

    @classmethod
    async def get_results(cls, session: AsyncSession, user_id: int):
        query = (
            select(EventORM)
            .options(
                selectinload(EventORM.results)
                .options(
                    selectinload(ResultORM.place),
                    selectinload(ResultORM.student)
                    .options(
                        selectinload(StudentProfileORM.student_data),
                    ),
                ),
            )
            .where(EventORM.coach_id == user_id)
            .order_by(desc(EventORM.date_start))
        )
        result_query = await session.execute(query)
        results = result_query.scalars().all()
        return results

    @classmethod
    async def get_result(cls, session: AsyncSession, result_id: int):
        query = (
            select(ResultORM)
            .where(ResultORM.id == result_id)
        )
        result = await session.scalar(query)
        return result

    @classmethod
    async def update_result(cls,
                            session,
                            event_id: int,
                            student_id: int,
                            place_id: int,
                            points_scored: int,
                            points_missed: int,
                            number_of_fights: int,
                            result_id: int):
        query = (
            update(ResultORM)
            .where(ResultORM.id == result_id)
            .values(student_id=student_id,
                    event_id=event_id,
                    place_id=place_id,
                    points_scored=points_scored,
                    points_missed=points_missed,
                    number_of_fights=number_of_fights,
                    average_score=points_scored / number_of_fights,
                    efficiency=(points_scored - points_missed) / number_of_fights,
                    )
        )
        await session.execute(query)
        await session.commit()

    @classmethod
    async def delete_result(cls, session: AsyncSession, result_id: int):
        query = (
            delete(ResultORM)
            .where(ResultORM.id == result_id)
        )
        await session.execute(query)
        await session.commit()