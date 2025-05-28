from pydantic import BaseModel
from typing import Optional

class GroupModel(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True
