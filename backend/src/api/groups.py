from fastapi import APIRouter, HTTPException, status, Depends
from src.dependency.dependencies import SessionDep, AuthUserDep

from src.requests.coaches import CoachRequest
from src.security import create_access_token
from src.models.groups import GroupORM
import src.schemas.groups as groups_schemas
import src.schemas.base as base_schemas

router = APIRouter(
    prefix="/groups",
)


@router.get("/",
            tags=["Группы"],
            summary="Список всех групп тренера",
            response_model=list[groups_schemas.GroupModel]
         )
async def get_coach_groups(session: SessionDep, user_id: AuthUserDep):
    groups =  await CoachRequest.get_coach_groups(session, user_id)
    return groups


@router.get("/{group_id}/students/",
            tags=["Группы"],
            summary="Список учеников в группе",
            response_model=list[base_schemas.StudentModel]
         )
async def get_students_in_group(
        session: SessionDep,
        group_id: int,
        user_id: AuthUserDep):
    students =  await CoachRequest.get_students_in_group(session, group_id)
    return students
