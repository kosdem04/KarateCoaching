from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from src.dependency.dependencies import SessionDep, AuthUserDep
from datetime import datetime

import src.models.sportsmen as sportsmen_models
from src.requests.sportsmen import SportsmanRequest
from src.requests.results import ResultRequest
import src.schemas.sportsmen as sportsmen_schemas


from src.s3_storage import S3Client
from src.config import (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
                        S3_BUCKET_NAME, S3_ENDPOINT_URL, S3_REGION_NAME)

router = APIRouter(
    prefix="/sportsmen",
)

async def get_current_user_sportsman(
    sportsman_id: int,
    session: SessionDep,
    user_id: AuthUserDep,
):
    sportsman = await SportsmanRequest.get_sportsman(session, sportsman_id)
    if not sportsman:
        raise HTTPException(status_code=404, detail="Спортсмен не найден")
    if sportsman.coach_id != user_id:
        raise HTTPException(status_code=403, detail="Нет доступа")
    return True


@router.get("",
            tags=["Спортсмены"],
            summary="Просмотр спортсменов тренера",
            response_model=list[sportsmen_schemas.SportsmanSimpleModel]
         )
async def get_sportsmen_by_coach(session: SessionDep,
                                 user_id: AuthUserDep):
    sportsmen = await SportsmanRequest.get_sportsmen_by_coach(session, user_id)
    return sportsmen



@router.get("/{sportsman_id}",
            tags=["Спортсмены"],
            summary="Информация о конкретном спортсмене",
            response_model=sportsmen_schemas.SportsmanInfoModel
         )
async def get_sportsman(session: SessionDep,
                        sportsman_id: int,
                        user_id: AuthUserDep,
                        user_sportsman: bool = Depends(get_current_user_sportsman)):
    sportsman = await SportsmanRequest.get_sportsman(session, sportsman_id)
    results = await ResultRequest.get_results_for_sportsman(session, sportsman_id)
    return {
        "sportsman": sportsman,
        "results": results,
    }


@router.post("/add",
            tags=["Спортсмены"],
            summary="Добавление спортсмена",
         )
async def add_sportsmen(session: SessionDep,
                         # data: sportsmen_schemas.AddUpdateSportsmanModel,
                         user_id: AuthUserDep,
                        first_name: str = Form(...),
                        patronymic: str = Form(""),
                        last_name: str = Form(...),
                        date_of_birth: datetime = Form(...),
                        avatar: UploadFile = File(None),
                        ):
    s3_client = S3Client(
        access_key=AWS_ACCESS_KEY_ID,
        secret_key=AWS_SECRET_ACCESS_KEY,
        endpoint_url=S3_ENDPOINT_URL,
        bucket_name=S3_BUCKET_NAME,
        region_name=S3_REGION_NAME,
    )

    avatar_filename = None
    avatar_url = None
    if avatar:
        avatar_filename = await s3_client.upload_file(avatar)
        avatar_url = await s3_client.get_file_url(avatar_filename)
    await SportsmanRequest.add_sportsman(session, first_name, patronymic, last_name, date_of_birth, avatar_url, user_id)
    return {"status": "ok"}



@router.put("/{sportsman_id}/update",
            tags=["Спортсмены"],
            summary="Изменение спортсмена",
         )
async def update_sportsmen(session: SessionDep,
                           sportsman_id: int,
                           user_id: AuthUserDep,
                           first_name: str = Form(...),
                           patronymic: str = Form(""),
                           last_name: str = Form(...),
                           date_of_birth: datetime = Form(...),
                           avatar: UploadFile = File(None),
                           user_sportsman: bool = Depends(get_current_user_sportsman)):
    s3_client = S3Client(
        access_key=AWS_ACCESS_KEY_ID,
        secret_key=AWS_SECRET_ACCESS_KEY,
        endpoint_url=S3_ENDPOINT_URL,
        bucket_name=S3_BUCKET_NAME,
        region_name=S3_REGION_NAME,
    )

    avatar_filename = None
    if avatar:
        avatar_filename = await s3_client.upload_file(avatar)
        avatar_url = await s3_client.get_file_url(avatar_filename)
        await SportsmanRequest.update_sportsmen_with_avatar(session, first_name, patronymic, last_name, date_of_birth, avatar_url,
                                                sportsman_id)
    else:
        await SportsmanRequest.update_sportsmen(session, first_name, patronymic, last_name, date_of_birth, sportsman_id)
    return {"status": "ok"}


@router.delete("/{sportsman_id}",
            tags=["Спортсмены"],
            summary="Удаление спортсмена",
         )
async def delete_sportsman(session: SessionDep,
                        sportsman_id: int,
                        user_id: AuthUserDep,
                           user_sportsman: bool = Depends(get_current_user_sportsman)):
    await SportsmanRequest.delete_sportsman(session, sportsman_id)
    return {"status": "ok"}
