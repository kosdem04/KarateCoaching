from pydantic import BaseModel
from typing import Optional
import datetime
from src.schemas.base import TypeEventModel


class AddEditEventModel(BaseModel):
    name: str
    type_id: int
    date_start: datetime.datetime
    date_end: datetime.datetime

    class Config:
        from_attributes = True


class EventSimpleModel(BaseModel):
    id: int
    name: str
    type_id: int
    date_start: datetime.datetime
    date_end: datetime.datetime
    coach_id: int

    class Config:
        from_attributes = True


class EventModel(BaseModel):
    id: int
    name: str
    type: Optional[TypeEventModel]
    date_start: datetime.datetime
    date_end: datetime.datetime
    coach_id: int

    class Config:
        from_attributes = True
