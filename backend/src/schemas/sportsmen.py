from pydantic import BaseModel
from typing import Optional
import datetime
from src.schemas.base import SportsmanSimpleModel
from src.schemas.results import SportsmanResultModel


class AddUpdateSportsmanModel(BaseModel):
    first_name: str
    patronymic: str
    last_name: str
    date_of_birth: datetime.datetime

    class Config:
        from_attributes = True


class SportsmanInfoModel(BaseModel):
    sportsman: Optional[SportsmanSimpleModel]
    results: list[SportsmanResultModel]