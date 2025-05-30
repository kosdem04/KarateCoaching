from pydantic import BaseModel, EmailStr
import datetime
from typing import Optional


class UserRegisterModel(BaseModel):
    first_name: str
    patronymic: Optional[str]
    last_name: str
    email: EmailStr
    password: str


class UserLoginModel(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class ResulSimpleModel(BaseModel):
    tournament_id: int
    student_id: int
    place_id: int
    points_scored: int
    points_missed: int
    number_of_fights: int
    average_score: float
    efficiency: float

    class Config:
        from_attributes = True


class StudentModel(BaseModel):
    id: int
    first_name: str
    patronymic: Optional[str]
    last_name: str
    email: EmailStr
    date_of_birth: Optional[datetime.date]
    phone_number: Optional[str]
    img_url: str

    class Config:
        from_attributes = True


class PlaceModel(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True