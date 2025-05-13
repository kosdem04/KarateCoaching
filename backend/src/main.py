from fastapi import FastAPI
import uvicorn
from starlette.middleware.cors import CORSMiddleware
from src.api import main_router


app = FastAPI()
app.include_router(main_router)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],  # Замените на адрес вашего React-приложения
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
#
#
# if __name__ == "__main__":
#     uvicorn.run("src.main:app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://karate-coaching.ru"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000)
