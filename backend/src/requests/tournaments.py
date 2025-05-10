from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, desc, delete
from sqlalchemy.orm import selectinload, joinedload
import src.schemas.tournaments as tournaments_schemas

from src.models.tournaments import  TournamentORM
from fastapi import HTTPException
from starlette import status



class TournamentRequest:
    @classmethod
    async def get_user_tournaments(cls, session: AsyncSession, user_id: int):
        query = (
            select(TournamentORM)
            .where(TournamentORM.user_id == user_id)
            .order_by(desc(TournamentORM.date_end))
        )
        result_query = await session.execute(query)
        results = result_query.scalars().all()
        tournaments = [tournaments_schemas.TournamentModel.model_validate(r) for r in results]
        return tournaments

    @classmethod
    async def get_tournament(cls, session: AsyncSession, tournament_id: int):
        query = (
            select(TournamentORM)
            .where(TournamentORM.id == tournament_id)
        )
        result = await session.scalar(query)
        tournament = tournaments_schemas.TournamentModel.model_validate(result)
        return tournament

    @classmethod
    async def add_tournament(cls, session, data: tournaments_schemas.AddEditTournamentModel, user_id):
        query = (
            select(TournamentORM)
            .where(TournamentORM.name == data.name,
                   TournamentORM.date_start == data.date_start,
                   TournamentORM.date_end == data.date_end,
                   TournamentORM.user_id == user_id)
        )
        tournament = await session.scalar(query)
        if not tournament:
            session.add(TournamentORM(
                name=data.name,
                date_start=data.date_start,
                date_end=data.date_end,
                user_id=user_id
            ))
            await session.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Такой турнир уже есть"
            )

    @classmethod
    async def update_tournament(cls, session: AsyncSession, data: tournaments_schemas.AddEditTournamentModel,
                            tournament_id: int):
        query = (
            update(TournamentORM)
            .where(TournamentORM.id == tournament_id)
            .values(
                name=data.name,
                date_start=data.date_start,
                date_end=data.date_end,
                    )
        )
        await session.execute(query)
        await session.commit()

    @classmethod
    async def delete_tournament(cls, session: AsyncSession, tournament_id: int):
        query = (
            delete(TournamentORM)
            .where(TournamentORM.id == tournament_id)
        )
        await session.execute(query)
        await session.commit()