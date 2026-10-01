import json
import time

import psycopg
import redis


REDIS_HOST = "localhost"
REDIS_PORT = 6379

DATABASE_URL = (
    "postgresql://shiptrack:shiptrack_dev_password"
    "@172.17.0.3:5432/shiptrack"
)

r = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    decode_responses=True,
)

print("ShipTrack Worker started", flush=True)


while True:
    message = r.brpop("telemetry", timeout=5)

    if message:
        telemetry = json.loads(message[1])

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
                    WHERE id = %(ship_id)s;
                    """,
                    telemetry,
                )

            connection.commit()

        print(
            f"Telemetry saved for ship {telemetry['ship_id']}",
            flush=True,
        )

    time.sleep(1)
