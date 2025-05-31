from fastapi import APIRouter, HTTPException, Depends
from src.dependency.dependencies import SessionDep, AuthUserDep

import src.schemas.events as events_schemas
from src.requests.events import EventRequest
import src.schemas.base as base_schemas

from src.s3_storage import S3Client
from src.config import (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
                        S3_BUCKET_NAME, S3_ENDPOINT_URL, S3_REGION_NAME)

router = APIRouter(
    prefix="/events",
)


async def get_current_coach_event(
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
            response_model=list[events_schemas.EventModel]
         )
async def get_coach_events(session: SessionDep,
                               user_id: AuthUserDep):
    events = await EventRequest.get_coach_events(session, user_id)
    return events



@router.get("/types",
            tags=["Мероприятия"],
            summary="Просмотр всех типов мероприятий",
            response_model=list[base_schemas.TypeEventModel]
         )
async def get_event_types(session: SessionDep,
                               user_id: AuthUserDep):
    types = await EventRequest.get_event_types(session)
    # types = [base_schemas.TypeEventModel.model_validate(r) for r in types_orm]
    return types


@router.get("/{event_id}",
            tags=["Мероприятия"],
            summary="Информация о конкретном мероприятии",
            response_model=events_schemas.EventSimpleModel
         )
async def get_event(session: SessionDep,
                         event_id: int,
                         user_id: AuthUserDep,
                         coach_event: bool = Depends(get_current_coach_event)):
    event = await EventRequest.get_event(session, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Мероприятие не найдено")
    return  event



@router.post("/add",
            tags=["Мероприятия"],
            summary="Добавление мероприятия",
         )
async def add_event(session: SessionDep,
                         data: events_schemas.AddEditEventModel,
                         user_id: AuthUserDep):
    await EventRequest.add_event(
        session=session,
        name=data.name,
        type_id=data.type_id,
        date_start=data.date_start,
        date_end=data.date_end,
        coach_id=user_id,
    )
    return {"status": "ok"}


@router.put("/{event_id}",
            tags=["Мероприятия"],
            summary="Изменение мероприятия",
         )
async def update_event(session: SessionDep,
                           event_id: int,
                           data: events_schemas.AddEditEventModel,
                           user_id: AuthUserDep,
                            coach_event: bool = Depends(get_current_coach_event)):
    await EventRequest.update_event(session=session,
        name=data.name,
        type_id=data.type_id,
        date_start=data.date_start,
        date_end=data.date_end,
        event_id=event_id,)
    return {"status": "ok"}



@router.delete("/{event_id}",
            tags=["Мероприятия"],
            summary="Удаление мероприятия",
         )
async def delete_event(session: SessionDep,
                            event_id: int,
                            user_id: AuthUserDep,
                            coach_event: bool = Depends(get_current_coach_event)):
    await EventRequest.delete_event(session, event_id)
    return {"status": "ok"}


