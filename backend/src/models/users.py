from src.database import Base
from typing import List, Optional
from sqlalchemy import ForeignKey, String, BigInteger
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase, relationship
import datetime


class UserORM(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True)
    last_name: Mapped[str] = mapped_column(String(64))
    first_name: Mapped[str] = mapped_column(String(30))
    patronymic: Mapped[str] = mapped_column(String(30), nullable=True)
    email: Mapped[str] = mapped_column(String(254))
    password: Mapped[str] = mapped_column(String(150))
    date_joined: Mapped[datetime.datetime]
    is_admin: Mapped[bool]
    img_url: Mapped[str] = mapped_column(String(1000))

    sportsmen: Mapped[List["SportsmanORM"]] = relationship(
        "SportsmanORM",
        back_populates="coach",
        cascade='all, delete'
    )
    tournaments: Mapped[List["TournamentORM"]] = relationship(
        "TournamentORM",
        back_populates="user",
        cascade='all, delete'
    )

    class RoleORM(Base):
        __tablename__ = 'roles'

        id: Mapped[int] = mapped_column(primary_key=True)
        name: Mapped[str] = mapped_column(String(50))