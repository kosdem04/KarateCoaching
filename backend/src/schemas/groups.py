from pydantic import BaseModel
from typing import Optional

class GroupModel(BaseModel):
    id: int
    name: str
    coach_id: int
    class Config:
        from_attributes = True


class AddEditGroupModel(BaseModel):
    name: str

    class Config:
        from_attributes = True


class AddStudentInGroupModel(BaseModel):
    group_id: int
    student_id: int

    class Config:
        from_attributes = True

