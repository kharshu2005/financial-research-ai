import json
import redis

REDIS_URL = "redis://localhost:6379/0"

redis_client = redis.Redis.from_url(
    REDIS_URL,
    decode_responses=True,
)


def set_cached_result(
    key: str,
    value: dict,
    expire_seconds: int = 1800,
):
    redis_client.setex(
        key,
        expire_seconds,
        json.dumps(value, default=str),
    )


def get_cached_result(key: str):
    cached_value = redis_client.get(key)

    if cached_value is None:
        return None

    return json.loads(cached_value)


def delete_cached_result(key: str):
    redis_client.delete(key)


def redis_health_check():
    try:
        return redis_client.ping()
    except Exception:
        return False