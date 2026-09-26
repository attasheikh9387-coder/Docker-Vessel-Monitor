import os

import psycopg
from fastapi import FastAPI

app = FastAPI(title="ShipTrack API")


DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://shiptrack:shiptrack_dev_password@172.17.0.2:5432/shiptrack",
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

@app.post("/ships")
def create_ship(ship: dict):
    with psycopg.connect(DATABASE_URL) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO ships (
                    name,
                    imo_number,
                    latitude,
                    longitude,
                    speed,
                    engine_temperature,
                    fuel_level,
                    engine_status
                )
                VALUES (
                    %(name)s,
                    %(imo_number)s,
                    %(latitude)s,
                    %(longitude)s,
                    %(speed)s,
                    %(engine_temperature)s,
                    %(fuel_level)s,
                    %(engine_status)s
                )
                RETURNING id;
                """,
                ship,
            )

            ship_id = cursor.fetchone()[0]

        connection.commit()

    return {
        "message": "Ship created successfully",
        "id": ship_id,
    }


@app.put("/ships/{ship_id}")
def update_ship(ship_id: int, ship: dict):
    with psycopg.connect(DATABASE_URL) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE ships
                SET
                    latitude = %(latitude)s,
                    longitude = %(longitude)s,
                    speed = %(speed)s,
                    engine_temperature = %(engine_temperature)s,
                    fuel_level = %(fuel_level)s,
                    engine_status = %(engine_status)s
                WHERE id = %(ship_id)s
                RETURNING id;
                """,
                {
                    **ship,
                    "ship_id": ship_id,
                },
            )

            row = cursor.fetchone()

        connection.commit()

    if row is None:
        return {
            "error": "Ship not found"
        }

    return {
        "message": "Ship telemetry updated",
        "id": row[0],
    }

@app.get("/ships/{ship_id}")
def get_ship(ship_id: int):
    with psycopg.connect(DATABASE_URL) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    name,
                    imo_number,
                    latitude,
                    longitude,
                    speed,
                    engine_temperature,
                    fuel_level,
                    engine_status
                FROM ships
                WHERE id = %s;
                """,
                (ship_id,),
            )

            row = cursor.fetchone()

    if row is None:
        return {
            "error": "Ship not found"
        }

    return {
        "id": row[0],
        "name": row[1],
        "imo_number": row[2],
        "latitude": row[3],
        "longitude": row[4],
        "speed": row[5],
        "engine_temperature": row[6],
        "fuel_level": row[7],
        "engine_status": row[8],
    }

@app.get("/ships")
def get_ships():
    with psycopg.connect(DATABASE_URL) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    name,
                    imo_number,
                    latitude,
                    longitude,
                    speed,
                    engine_temperature,
                    fuel_level,
                    engine_status
                FROM ships
                ORDER BY id;
                """
            )

            rows = cursor.fetchall()

    ships = []

    for row in rows:
        ships.append(
            {
                "id": row[0],
                "name": row[1],
                "imo_number": row[2],
                "latitude": row[3],
                "longitude": row[4],
                "speed": row[5],
                "engine_temperature": row[6],
                "fuel_level": row[7],
                "engine_status": row[8],
            }
        )

    return ships 
