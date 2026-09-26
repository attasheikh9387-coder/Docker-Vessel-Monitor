import random
import time

import requests


API_URL = "http://localhost:8000/ships/1"

ship = {
    "name": "Atlantic Star",
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
        "latitude": ship["latitude"],
        "longitude": ship["longitude"],
        "speed": ship["speed"],
        "engine_temperature": ship["engine_temperature"],
        "fuel_level": ship["fuel_level"],
        "engine_status": ship["engine_status"],
    }

    try:
        response = requests.put(API_URL, json=telemetry)

        print(
            f"Telemetry sent | "
            f"Speed: {ship['speed']:.2f} | "
            f"Temperature: {ship['engine_temperature']:.2f} | "
            f"Fuel: {ship['fuel_level']:.2f} | "
            f"Status: {response.status_code}",
            flush=True,
        )

    except requests.RequestException as error:
        print(f"Failed to send telemetry: {error}", flush=True)

    time.sleep(5)
