from pydantic import BaseModel, EmailStr
import datetime
from typing import Optional
from src.schemas.base import StudentModel
from src.schemas.base import PlaceModel
from src.schemas.tournaments import TournamentModel


class StudentProfileModel(BaseModel):
    student_data: Optional[StudentModel]
    coach_id: Optional[int]
    group_id: Optional[int]

    class Config:
        from_attributes = True


class StudentResultModel(BaseModel):
    # tournament: Optional[TournamentModel]
    tournament_id: int
    student_id: int
    place: Optional[PlaceModel]
    points_scored: int
    points_missed: int
    number_of_fights: int
    average_score: float
    efficiency: float

    class Config:
        from_attributes = True