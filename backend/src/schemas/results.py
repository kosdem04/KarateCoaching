from pydantic import BaseModel
from typing import Optional
import datetime
from src.schemas.base import SportsmanSimpleModel
from src.schemas.tournaments import TournamentModel


class PlaceModel(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class SportsmanResultModel(BaseModel):
    tournament: Optional[TournamentModel]
    sportsman_id: int
    place: Optional[PlaceModel]
    points_scored: int
    points_missed: int
    number_of_fights: int
    average_score: float
    efficiency: float

    class Config:
        from_attributes = True


class AddEditResultModel(BaseModel):
    tournament_id: int
    sportsman_id: int
    place_id: int
    points_scored: int
    points_missed: int
    number_of_fights: int

    class Config:
        from_attributes = True


class ResultModel(BaseModel):
    tournament_id: int
    sportsman: Optional[SportsmanSimpleModel]
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
