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
    phone_number: Mapped[str] = mapped_column(String(20), nullable=True)
    password: Mapped[str] = mapped_column(String(150))
    date_joined: Mapped[datetime.date]
    date_of_birth: Mapped[datetime.date] = mapped_column(nullable=True)
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
    groups: Mapped[List["GroupORM"]] = relationship(
        "GroupORM",
        back_populates="coach",
        cascade='all, delete'
    )
    roles: Mapped[List["RoleORM"]] = relationship(
        "RoleORM",
        back_populates="users",
        secondary="user_roles"
    )

    # один-к-одному: если пользователь — ученик
    student_profile: Mapped[Optional["StudentProfileORM"]] = relationship(
        "StudentProfileORM",
        back_populates="student_data",
        uselist=False,
        foreign_keys="[StudentProfileORM.student_id]"
    )

    # один-ко-многим: если пользователь — тренер
    student: Mapped[List["StudentProfileORM"]] = relationship(
        "StudentProfileORM",
        back_populates="coach",
        foreign_keys="[StudentProfileORM.coach_id]"
    )



class RoleORM(Base):
    __tablename__ = 'roles'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True)
    code: Mapped[str] = mapped_column(String(50), unique=True)

    user_roles: Mapped[List["UserRoleORM"]] = relationship(
        "UserRoleORM",
        back_populates="role",
        cascade='all, delete'
    )

    users: Mapped[List["UserORM"]] = relationship(
        "UserORM",
        back_populates="roles",
        secondary="user_roles"
    )



class UserRoleORM(Base):
    __tablename__ = 'user_roles'

    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete='CASCADE'),
                                         primary_key=True)
    role_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey('roles.id', ondelete='SET NULL')
    )

    role: Mapped["RoleORM"] = relationship(
        "RoleORM",
        back_populates="user_roles"
    )
