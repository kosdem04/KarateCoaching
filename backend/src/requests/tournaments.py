from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, desc, delete
from sqlalchemy.orm import selectinload, joinedload
import src.schemas.tournaments as tournaments_schemas

from src.models.tournaments import  EventORM
from fastapi import HTTPException
from starlette import status



class EventRequest:
    @classmethod
    async def get_coach_events(cls, session: AsyncSession, coach_id: int):
        query = (
            select(EventORM)
            .where(EventORM.coach_id == coach_id)
            .order_by(desc(EventORM.date_start))
        )
        result_query = await session.execute(query)
        results = result_query.scalars().all()
        tournaments = [tournaments_schemas.EventModel.model_validate(r) for r in results]
        return tournaments

    @classmethod
    async def get_event(cls, session: AsyncSession, event_id: int):
        query = (
            select(EventORM)
            .where(EventORM.id == event_id)
        )
        result = await session.scalar(query)
        event = tournaments_schemas.EventModel.model_validate(result)
        return event

    @classmethod
    async def add_event(cls, session, data: tournaments_schemas.AddEditEventModel, user_id):
        query = (
            select(EventORM)
            .where(EventORM.name == data.name,
                   EventORM.date_start == data.date_start,
                   EventORM.date_end == data.date_end,
                   EventORM.coach_id == user_id)
        )
        event = await session.scalar(query)
        if not event:
            session.add(EventORM(
                name=data.name,
                date_start=data.date_start,
                date_end=data.date_end,
                coach_id=user_id,
                type_id=1,
            ))
            await session.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Такое мероприятие уже есть"
            )

    @classmethod
    async def update_event(cls, session: AsyncSession, data: tournaments_schemas.AddEditEventModel,
                            event_id: int):
        query = (
            update(EventORM)
            .where(EventORM.id == event_id)
            .values(
                name=data.name,
                date_start=data.date_start,
                date_end=data.date_end,
                    )
        )
        await session.execute(query)
        await session.commit()

    @classmethod
    async def delete_event(cls, session: AsyncSession, event_id: int):
        query = (
            delete(EventORM)
            .where(EventORM.id == event_id)
        )
        await session.execute(query)
        await session.commit()