import json

from fastapi import FastAPI, HTTPException

from src.schemas.table import Table, TableDetailed, Column

app = FastAPI()

table_db_detailed = [
    TableDetailed(uuid='2646ad73-2c93-4f72-96a5-e8b1383bacc9', name='Foo', database_name='my_db', columns=[
        Column(uuid='d40a6e0a-a0ef-4a99-b659-acadf5ab5ebd',
               name='slug', type='string'),
        Column(uuid='0c61bef7-e043-422e-b563-df159e7e596b',
               name='count', type='integer'),
    ])
]

CACHE_LOC = '/data/cache.json'


@app.get("/tables")
async def tables() -> list[Table]:
    data = []
    with open(CACHE_LOC, 'r') as f:
        data = json.load(f).values()
        f.close()
    return data


@app.get("/table/{uuid}")
async def table(uuid: str) -> TableDetailed:
    data = {}
    with open(CACHE_LOC, 'r') as f:
        data = json.load(f)
        f.close()

    if uuid not in data:
        raise HTTPException(status_code=404, detail=f"No table registered with UUID {uuid}")

    return data[uuid]
