from src.database import Base
from typing import List, Optional
from sqlalchemy import ForeignKey, String, BigInteger
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase, relationship
import datetime


class SportsmanORM(Base):
    __tablename__ = 'sportsmen'

    id: Mapped[int] = mapped_column(primary_key=True)
    last_name: Mapped[str] = mapped_column(String(64))
    first_name: Mapped[str] = mapped_column(String(30))
    patronymic: Mapped[str] = mapped_column(String(30), nullable=True)
    date_of_birth: Mapped[datetime.datetime]
    img_url: Mapped[str] = mapped_column(String(1000))
    coach_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey('users.id', ondelete='SET NULL')
    )

    coach: Mapped["UserORM"] = relationship(
        "UserORM",
        back_populates="sportsmen"
    )
    results: Mapped[List["ResultORM"]] = relationship(
        "ResultORM",
        back_populates="sportsman",
        cascade='all, delete'
    )