from pydantic import BaseModel
from typing import Optional
import datetime
from src.schemas.base import StudentModel
from src.schemas.students import StudentProfileModel


class PlaceModel(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class AddEditResultModel(BaseModel):
    event_id: int
    student_id: int
    place_id: int
    points_scored: int
    points_missed: int
    number_of_fights: int

    class Config:
        from_attributes = True


class ResultModel(BaseModel):
    id: int
    event_id: int
    student: Optional[StudentProfileModel]
    place: Optional[PlaceModel]
    points_scored: int
    points_missed: int
    number_of_fights: int
    average_score: float
    efficiency: float

    class Config:
        from_attributes = True


class EventWithResultModel(BaseModel):
    id: int
    name: str
    date_start: datetime.datetime
    date_end: datetime.datetime
    coach_id: int
    results: list[ResultModel]

    class Config:
        from_attributes = True
