from pydantic import BaseModel
from typing import Optional
import datetime


class AddEditEventModel(BaseModel):
    name: str
    date_start: datetime.datetime
    date_end: datetime.datetime

    class Config:
        from_attributes = True



class EventModel(BaseModel):
    id: int
    name: str
    date_start: datetime.datetime
    date_end: datetime.datetime
    coach_id: int

    class Config:
        from_attributes = True
