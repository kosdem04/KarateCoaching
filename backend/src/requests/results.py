from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, desc, delete, asc
from sqlalchemy.orm import selectinload, joinedload

from src.models.results import ResultORM, PlaceORM
import src.schemas.results as results_schemas
import src.schemas.base as base_schemas
from fastapi import HTTPException
from starlette import status

from src.models.tournaments import TournamentORM


class ResultRequest:
    @classmethod
    async def  get_results_for_sportsman(cls, session:AsyncSession, sportsman_id: int):
        query = (
            select(ResultORM)
            .join(ResultORM.tournament)
            .options(
                selectinload(ResultORM.tournament),
                selectinload(ResultORM.place),
            )
            .where(ResultORM.sportsman_id == sportsman_id)
            .order_by(asc(TournamentORM.date_start))
        )
        result_query = await session.execute(query)
        results = result_query.unique().scalars().all()
        sportsman_results = [results_schemas.SportsmanResultModel.model_validate(r) for r in results]
        return sportsman_results

    @classmethod
    async def add_result(cls, session, data: results_schemas.AddEditResultModel):
        query = (
            select(ResultORM)
            .where(ResultORM.tournament_id == data.tournament_id,
                   ResultORM.sportsman_id == data.sportsman_id,
                   ResultORM.place_id == data.place_id,
                   ResultORM.points_scored == data.points_scored,
                   ResultORM.points_missed == data.points_missed,
                   ResultORM.number_of_fights == data.number_of_fights,
                   )
        )
        result = await session.scalar(query)
        if not result:
            session.add(ResultORM(
                tournament_id=data.tournament_id,
                sportsman_id=data.sportsman_id,
                place_id=data.place_id,
                points_scored=data.points_scored,
                points_missed=data.points_missed,
                number_of_fights=data.number_of_fights,
                average_score=data.points_scored / data.number_of_fights,
                efficiency=(data.points_scored - data.points_missed) / data.number_of_fights,
            ))
            await session.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Такой турнир уже есть"
            )

    @classmethod
    async def get_places(cls, session: AsyncSession):
        query = (
            select(PlaceORM)
        )
        result_query = await session.execute(query)
        results = result_query.scalars().all()
        places = [results_schemas.PlaceModel.model_validate(r) for r in results]
        return places

    @classmethod
    async def get_results(cls, session: AsyncSession, user_id: int):
        query = (
            select(TournamentORM)
            .options(
                selectinload(TournamentORM.results)
                .options(
                    selectinload(ResultORM.place),
                    selectinload(ResultORM.sportsman),
                ),
            )
            .where(TournamentORM.user_id == user_id)
            .order_by(desc(TournamentORM.date_start))
        )
        result_query = await session.execute(query)
        results = result_query.scalars().all()
        user_results = [results_schemas.TournamentWithResultModel.model_validate(r) for r in results]
        return user_results

    @classmethod
    async def get_result(cls, session: AsyncSession, result_id: int):
        query = (
            select(ResultORM)
            .where(ResultORM.id == result_id)
        )
        result_query = await session.scalar(query)
        result = base_schemas.ResulSimpleModel.model_validate(result_query)
        return result

    @classmethod
    async def update_result(cls, session: AsyncSession, data: results_schemas.AddEditResultModel,
                               result_id: int):
        query = (
            update(ResultORM)
            .where(ResultORM.id == result_id)
            .values(sportsman_id=data.sportsman_id,
                    tournament_id=data.tournament_id,
                    place_id=data.place_id,
                    points_scored=data.points_scored,
                    points_missed=data.points_missed,
                    number_of_fights=data.number_of_fights,
                    average_score=data.points_scored / data.number_of_fights,
                    efficiency=(data.points_scored - data.points_missed) / data.number_of_fights,
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