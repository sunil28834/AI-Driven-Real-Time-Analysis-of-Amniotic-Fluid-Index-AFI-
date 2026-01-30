from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from contextlib import asynccontextmanager
from app.routers import auth, prediction, history, patients
from app.utils.database import connect_to_mongo, close_mongo_connection
from app.routers import chat

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await connect_to_mongo()
    except Exception as e:
        print(f"⚠️  Starting without database: {e}")
    yield
    await close_mongo_connection()

app = FastAPI(title="Amniotic Fluid Analysis API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(prediction.router, prefix="/api")
app.include_router(history.router, prefix="/api")
app.include_router(patients.router, prefix="/api")
app.include_router(chat.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Amniotic Fluid Analysis API"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Amniotic Fluid Analysis API",
        "version": "1.0.0"
    }


