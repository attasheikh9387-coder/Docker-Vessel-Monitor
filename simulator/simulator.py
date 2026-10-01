import json
import random
import time

import redis


REDIS_HOST = "localhost"
REDIS_PORT = 6379

r = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    decode_responses=True,
)

ship = {
    "ship_id": 1,
    "latitude": 41.0082,
    "longitude": 28.9784,
    "speed": 18.5,
    "engine_temperature": 82.0,
    "fuel_level": 76.0,
    "engine_status": "running",
}


while True:
    ship["latitude"] += random.uniform(-0.001, 0.001)
    ship["longitude"] += random.uniform(-0.001, 0.001)

    ship["speed"] = max(
        0,
        ship["speed"] + random.uniform(-0.5, 0.5),
    )

    ship["engine_temperature"] = max(
        60,
        ship["engine_temperature"] + random.uniform(-1, 1),
    )

    ship["fuel_level"] = max(
        0,
        ship["fuel_level"] - random.uniform(0, 0.05),
    )

    telemetry = {
        "ship_id": ship["ship_id"],
        "latitude": ship["latitude"],
        "longitude": ship["longitude"],
        "speed": ship["speed"],
        "engine_temperature": ship["engine_temperature"],
        "fuel_level": ship["fuel_level"],
        "engine_status": ship["engine_status"],
    }

    r.lpush("telemetry", json.dumps(telemetry))

    print(
        f"Telemetry queued | "
        f"Speed: {ship['speed']:.2f} | "
        f"Temperature: {ship['engine_temperature']:.2f} | "
        f"Fuel: {ship['fuel_level']:.2f}",
        flush=True,
    )

    time.sleep(5)
