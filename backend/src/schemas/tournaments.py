from pydantic import BaseModel
from typing import Optional
import datetime


class AddEditTournamentModel(BaseModel):
    name: str
    date_start: datetime.datetime
    date_end: datetime.datetime

    class Config:
        from_attributes = True



class TournamentModel(BaseModel):
    id: int
    name: str
    date_start: datetime.datetime
    date_end: datetime.datetime
    user_id: int

    class Config:
        from_attributes = True
