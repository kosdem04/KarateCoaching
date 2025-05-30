from fastapi import APIRouter, HTTPException, Depends
from src.dependency.dependencies import SessionDep, AuthUserDep

import src.models.tournaments as tournaments_models
import src.schemas.tournaments as tournaments_schemas

from src.s3_storage import S3Client
from src.config import (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
                        S3_BUCKET_NAME, S3_ENDPOINT_URL, S3_REGION_NAME)

router = APIRouter(
    prefix="/tournaments",
)


async def get_current_user_tournament(
    tournament_id: int,
    session: SessionDep,
    user_id: AuthUserDep,
):
    tournament = await TournamentRequest.get_tournament(session, tournament_id)
    if not tournament:
        raise HTTPException(status_code=404, detail="Турнир не найден")
    if tournament.user_id != user_id:
        raise HTTPException(status_code=403, detail="Нет доступа")
    return True


@router.get("/",
            tags=["Мероприятия"],
            summary="Просмотр всех мероприятий",
            response_model=list[tournaments_schemas.EventModel]
         )
async def get_coach_events(session: SessionDep,
                               user_id: AuthUserDep):
    events = await TournamentRequest.get_coach_events(session, user_id)
    return events


# @router.get("/{tournament_id}",
#             tags=["Турниры"],
#             summary="Информация о конкретном турнире",
#             response_model=tournaments_schemas.TournamentModel
#          )
# async def get_tournament(session: SessionDep,
#                          tournament_id: int,
#                          user_id: AuthUserDep,
#                          user_tournament: bool = Depends(get_current_user_tournament)):
#     tournament = await TournamentRequest.get_tournament(session, tournament_id)
#     if not tournament:
#         raise HTTPException(status_code=404, detail="Турнир не найден")
#     return  tournament
#
#
#
# @router.post("/add",
#             tags=["Турниры"],
#             summary="Добавление турнира",
#          )
# async def add_tournament(session: SessionDep,
#                          data: tournaments_schemas.AddEditTournamentModel,
#                          user_id: AuthUserDep):
#     await TournamentRequest.add_tournament(session, data, user_id)
#     return {"status": "ok"}
#
#
# @router.put("/{tournament_id}/update",
#             tags=["Турниры"],
#             summary="Изменение турнира",
#          )
# async def update_tournament(session: SessionDep,
#                            tournament_id: int,
#                            data: tournaments_schemas.AddEditTournamentModel,
#                            user_id: AuthUserDep,
#                             user_tournament: bool = Depends(get_current_user_tournament)):
#     await TournamentRequest.update_tournament(session, data, tournament_id)
#     return {"status": "ok"}
#
#
#
# @router.delete("/{tournament_id}",
#             tags=["Турниры"],
#             summary="Удаление турнира",
#          )
# async def delete_tournament(session: SessionDep,
#                             tournament_id: int,
#                             user_id: AuthUserDep,
#                             user_tournament: bool = Depends(get_current_user_tournament)):
#     await TournamentRequest.delete_tournament(session, tournament_id)
#     return {"status": "ok"}


