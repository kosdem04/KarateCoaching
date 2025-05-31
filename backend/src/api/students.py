from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from src.dependency.dependencies import SessionDep, AuthUserDep

from src.requests.students import StudentRequest
from src.security import create_access_token
from src.models.groups import GroupORM
import src.schemas.students as students_schemas
import src.schemas.base as base_schemas
import datetime
from src.s3_storage import S3Client
from src.config import (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
                        S3_BUCKET_NAME, S3_ENDPOINT_URL, S3_REGION_NAME)

router = APIRouter(
    prefix="/students",
)

async def get_current_coach_student(
    student_id: int,
    session: SessionDep,
    user_id: AuthUserDep,
):
    student = await StudentRequest.get_student_info(session, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Спортсмен не найден")
    if student.coach_id != user_id:
        raise HTTPException(status_code=403, detail="Нет доступа")
    return True



@router.get("/",
            tags=["Ученики"],
            summary="Просмотр учеников тренера",
            response_model=list[base_schemas.StudentModel]
         )
async def get_students_by_coach(session: SessionDep,
                                 user_id: AuthUserDep):
    students_orm = await StudentRequest.get_students_by_coach(session, user_id)
    students = [base_schemas.StudentModel.model_validate(r.student_data) for r in students_orm]
    return students



@router.get("/{student_id}",
            tags=["Ученики"],
            summary="Информация об ученике",
            response_model=students_schemas.StudentProfileModel
         )
async def get_student_info(
        session: SessionDep,
        student_id: int,
        user_id: AuthUserDep):
    student =  await StudentRequest.get_student_info(session, student_id)
    return student



@router.get("/{student_id}/results",
            tags=["Ученики"],
            summary="Получение результатов ученика",
            response_model=list[students_schemas.StudentResultModel]
         )
async def get_student_results(
        session: SessionDep,
        student_id: int,
        user_id: AuthUserDep):
    results =  await StudentRequest.get_student_results(session, student_id)
    return results


@router.post("/add",
            tags=["Ученики"],
            summary="Добавление ученика",
         )
async def add_student(session: SessionDep,
                         user_id: AuthUserDep,
                        first_name: str = Form(...),
                        patronymic: str = Form(""),
                        last_name: str = Form(...),
                        date_of_birth: datetime.date = Form(...),
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
    await StudentRequest.add_student(session, first_name, patronymic, last_name, date_of_birth, avatar_url, user_id)
    return {"status": "ok"}




@router.put("/{student_id}",
            tags=["Ученики"],
            summary="Изменение ученика",
         )
async def update_student(session: SessionDep,
                           student_id: int,
                           user_id: AuthUserDep,
                           first_name: str = Form(...),
                           patronymic: str = Form(""),
                           last_name: str = Form(...),
                           date_of_birth: datetime.date = Form(...),
                           avatar: UploadFile = File(None),
                           coach_student: bool = Depends(get_current_coach_student)):
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
        await StudentRequest.update_student_with_avatar(session, first_name, patronymic, last_name, date_of_birth, avatar_url,
                                                student_id)
    else:
        await StudentRequest.update_student(session, first_name, patronymic, last_name, date_of_birth, student_id)
    return {"status": "ok"}


@router.delete("/{student_id}",
            tags=["Ученики"],
            summary="Удаление ученика",
         )
async def delete_student(session: SessionDep,
                        student_id: int,
                        user_id: AuthUserDep,
                        coach_student: bool = Depends(get_current_coach_student)):
    await StudentRequest.delete_student(session, student_id)
    return {"status": "ok"}

