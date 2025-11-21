from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, db, router

# Define allowed origins (where the frontend runs)
origins = [
    "http://localhost:5173", # Vite development server default
    "http://127.0.0.1:5173",
    "http://localhost:3000", # Common React/CRA default
    "http://127.0.0.1:8000", # Accessing the docs
]

app = FastAPI(title='VitalsTracker API')

# Add CORS Middleware to allow cross-origin requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router.router)

# Create tables in the SQLite database on startup
@app.on_event('startup')
def startup():
    # Use db.Base to access the metadata for table creation
    db.Base.metadata.create_all(bind=db.engine)