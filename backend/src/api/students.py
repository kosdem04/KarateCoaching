from fastapi import APIRouter, HTTPException, status, Depends
from src.dependency.dependencies import SessionDep, AuthUserDep

from src.requests.students import StudentRequest
from src.security import create_access_token
from src.models.groups import GroupORM
import src.schemas.groups as groups_schemas

router = APIRouter(
    prefix="/students",
)



@router.get("/{student_id}/",
            tags=["Ученики"],
            summary="Информация об ученике",
            # response_model=list[groups_schemas.GroupModel]
         )
async def get_student_info(
        session: SessionDep,
        student_id: int,
        user_id: AuthUserDep):
    student =  await StudentRequest.get_student_info(session, student_id)
    return student
