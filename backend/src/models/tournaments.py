from src.database import Base
from typing import List, Optional
import datetime
from sqlalchemy import ForeignKey, String, BigInteger
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase, relationship
from sqlalchemy import Numeric
from decimal import Decimal


class EventORM(Base):
    __tablename__ = 'events'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    coach_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey('users.id', ondelete='SET NULL')
    )
    type_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey('event_types.id', ondelete='SET NULL')
    )
    date_start: Mapped[datetime.datetime]
    date_end: Mapped[datetime.datetime]

    results: Mapped[List["ResultORM"]] = relationship(
        "ResultORM",
        back_populates="events",
        passive_deletes=True
    )
    coach: Mapped["UserORM"] = relationship(
        "UserORM",
        back_populates="events"
    )
    type: Mapped["EventTypeORM"] = relationship(
        "EventTypeORM",
        back_populates="events"
    )



class EventTypeORM(Base):
    __tablename__ = 'event_types'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)

    events: Mapped[List["EventORM"]] = relationship(
        "EventORM",
        back_populates="type",
        passive_deletes=True
    )