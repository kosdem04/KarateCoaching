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
        back_populates="event",
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
    students: Mapped[List["StudentProfileORM"]] = relationship(
        "StudentProfileORM",
        back_populates="events",
        secondary="students_events"
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


class StudentEventORM(Base):
    __tablename__ = 'students_events'

    student_id: Mapped[int] = mapped_column(
        ForeignKey('student_profiles.student_id', ondelete='CASCADE'),
        primary_key=True
    )
    event_id: Mapped[int] = mapped_column(
        ForeignKey('events.id', ondelete='CASCADE'),
        primary_key=True
    )
