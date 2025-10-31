# Improvement Priorities

## Backend
1. Add solid tests around the advocates API (search, pagination, edge cases) so we notice regressions early.
2. Add indexes or other tweaks to keep those ILIKE searches snappy once the table grows.
3. Add query param validation and return cleaner error payloads instead of the current generic 500s.

## Frontend
1. Write tests for the hook and infinite scroll flow—loading, errors, retry.
2. Make the infinite scroll experience friendlier maybe show 'no more results' or add a retry when it fails.
3. Add formatting helpers for phone numbers, email etc.
4. Enhance search with adding options to filter and sort by specific fields.
