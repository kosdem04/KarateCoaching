from fastapi import APIRouter
from src.api.sportsmen import router as sportsmen_router
from src.api.tournaments import router as tournaments_router
from src.api.results import router as results_router
from src.api.auth import router as auth_router



main_router = APIRouter()
main_router.include_router(results_router)
main_router.include_router(sportsmen_router)
main_router.include_router(tournaments_router)
main_router.include_router(auth_router)