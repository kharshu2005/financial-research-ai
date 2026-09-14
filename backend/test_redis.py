from app.services.redis_cache import (
    redis_health_check,
    set_cached_result,
    get_cached_result,
)


print("Redis connection:", redis_health_check())

test_data = {
    "company": "Apple Inc.",
    "ticker": "AAPL",
}

set_cached_result(
    "test:redis",
    test_data,
    expire_seconds=60,
)

result = get_cached_result("test:redis")

print("Cached result:", result)