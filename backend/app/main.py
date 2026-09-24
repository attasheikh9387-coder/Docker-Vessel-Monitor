import os

import psycopg
from fastapi import FastAPI

app = FastAPI(title="ShipTrack API")


DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://shiptrack:shiptrack_dev_password@172.17.0.3:5432/shiptrack"
)


@app.get("/")
def root():
    return {
        "service": "ShipTrack API",
        "status": "running",
    }


@app.get("/health")
def health():
    try:
        with psycopg.connect(DATABASE_URL):
            return {
                "status": "healthy",
                "database": "connected",
            }
    except Exception:
        return {
            "status": "unhealthy",
            "database": "disconnected",
        }
