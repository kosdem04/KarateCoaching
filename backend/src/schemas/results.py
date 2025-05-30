from pydantic import BaseModel
from typing import Optional
import datetime
from src.schemas.tournaments import TournamentModel
from src.schemas.base import StudentModel
from src.schemas.students import StudentProfileModel


class PlaceModel(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class AddEditResultModel(BaseModel):
    tournament_id: int
    student_id: int
    place_id: int
    points_scored: int
    points_missed: int
    number_of_fights: int

    class Config:
        from_attributes = True


class ResultModel(BaseModel):
    id: int
    tournament_id: int
    student: Optional[StudentProfileModel]
    place: Optional[PlaceModel]
    points_scored: int
    points_missed: int
    number_of_fights: int
    average_score: float
    efficiency: float

    class Config:
        from_attributes = True


class TournamentWithResultModel(BaseModel):
    id: int
    name: str
    date_start: datetime.datetime
    date_end: datetime.datetime
    user_id: int
    results: list[ResultModel]

    class Config:
        from_attributes = True
