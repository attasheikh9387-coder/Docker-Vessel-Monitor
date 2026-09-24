from fastapi import FastAPI

app = FastAPI(title="ShipTrack API")


@app.get("/")
def root():
    return {
        "service": "ShipTrack API",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
