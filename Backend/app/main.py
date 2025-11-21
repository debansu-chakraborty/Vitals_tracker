from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, db, router

app = FastAPI(title='VitalsTracker API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"], # 5173 is default for Vite/React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router.router)

@app.on_event('startup')
def startup():
    models.Base.metadata.create_all(bind=db.engine)