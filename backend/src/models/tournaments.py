from src.database import Base
from typing import List, Optional
import datetime
from sqlalchemy import ForeignKey, String, BigInteger
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase, relationship
from sqlalchemy import Numeric
from decimal import Decimal


class TournamentORM(Base):
    __tablename__ = 'tournaments'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey('users.id', ondelete='SET NULL')
    )
    date_start: Mapped[datetime.datetime]
    date_end: Mapped[datetime.datetime]

    results: Mapped[List["ResultORM"]] = relationship(
        "ResultORM",
        back_populates="tournament",
        cascade='all, delete'
    )
    user: Mapped["UserORM"] = relationship(
        "UserORM",
        back_populates="tournaments"
    )
