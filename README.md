# ShipTrack 🚢

A containerized ship fleet telemetry monitoring platform built with Docker Compose.

## Overview

ShipTrack simulates ship telemetry, processes incoming data, stores it in PostgreSQL, and displays fleet information through a web dashboard.

## Architecture

- React + Vite frontend served by Nginx
- FastAPI backend
- PostgreSQL database
- Redis message queue
- Python telemetry simulator
- Python background worker
- Docker and Docker Compose

## Data Flow

1. Simulator generates ship telemetry.
2. Redis queues incoming messages.
3. Worker consumes messages from Redis.
4. Worker saves telemetry into PostgreSQL.
5. FastAPI provides ship data through REST API endpoints.
6. Frontend displays ship information.

## Docker Services

| Service | Purpose |
|---|---|
| Frontend | Web dashboard |
| API | Backend REST API |
| PostgreSQL | Persistent database |
| Redis | Message queue |
| Worker | Telemetry processing |
| Simulator | Telemetry generation |

## Getting Started

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd shiptrack
Start the application:

docker compose up -d --build

Check services:

docker compose ps

View logs:

docker compose logs -f

Stop the application:

docker compose down

## Application URLs

- Frontend: http://localhost:5173
- API: http://localhost:8000
- Health: http://localhost:8000/health
- Ship data: http://localhost:8000/ships

## Docker Concepts Demonstrated

- Multi-container orchestration
- Docker networking
- Persistent volumes
- Health checks
- Environment variables
- Containerized frontend builds
- Background processing
- Redis messaging

## Project Status

Core application and Docker Compose deployment completed.

## Future Improvements

- Prometheus and Grafana monitoring
- GitHub Actions CI/CD
- Automated testing
- Production security hardening
