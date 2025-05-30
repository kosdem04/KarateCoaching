from fastapi import APIRouter, HTTPException, Depends
from src.dependency.dependencies import SessionDep, AuthUserDep

import src.models.tournaments as tournaments_models
import src.schemas.tournaments as tournaments_schemas
from src.requests.tournaments import EventRequest

from src.s3_storage import S3Client
from src.config import (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
                        S3_BUCKET_NAME, S3_ENDPOINT_URL, S3_REGION_NAME)

router = APIRouter(
    prefix="/events",
)


async def get_current_user_tournament(
    event_id : int,
    session: SessionDep,
    user_id: AuthUserDep,
):
    event = await EventRequest.get_event(session, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Мероприятие не найдено")
    if event.coach_id != user_id:
        raise HTTPException(status_code=403, detail="Нет доступа")
    return True


@router.get("/",
            tags=["Мероприятия"],
            summary="Просмотр всех мероприятий",
            response_model=list[tournaments_schemas.EventModel]
         )
async def get_coach_events(session: SessionDep,
                               user_id: AuthUserDep):
    events = await EventRequest.get_coach_events(session, user_id)
    return events


@router.get("/{event_id}",
            tags=["Мероприятия"],
            summary="Информация о конкретном мероприятии",
            response_model=tournaments_schemas.EventModel
         )
async def get_event(session: SessionDep,
                         event_id: int,
                         user_id: AuthUserDep,
                         user_tournament: bool = Depends(get_current_user_tournament)):
    event = await EventRequest.get_event(session, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Мероприятие не найдено")
    return  event



@router.post("/add",
            tags=["Мероприятие"],
            summary="Добавление мероприятия",
         )
async def add_event(session: SessionDep,
                         data: tournaments_schemas.AddEditEventModel,
                         user_id: AuthUserDep):
    await EventRequest.add_event(session, data, user_id)
    return {"status": "ok"}


@router.put("/{event_id}",
            tags=["Мероприятия"],
            summary="Изменение мероприятия",
         )
async def update_event(session: SessionDep,
                           event_id: int,
                           data: tournaments_schemas.AddEditEventModel,
                           user_id: AuthUserDep,
                            user_tournament: bool = Depends(get_current_user_tournament)):
    await EventRequest.update_event(session, data, event_id)
    return {"status": "ok"}



@router.delete("/{event_id}",
            tags=["Мероприятие"],
            summary="Удаление мероприятия",
         )
async def delete_event(session: SessionDep,
                            event_id: int,
                            user_id: AuthUserDep,
                            user_tournament: bool = Depends(get_current_user_tournament)):
    await EventRequest.delete_event(session, event_id)
    return {"status": "ok"}


