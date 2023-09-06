from pydantic import BaseModel


class TableBase(BaseModel):
    uuid: str
    name: str
    database_name: str
    description: str | None = None


class Table(TableBase):
    class Config:
        orm_mode = True


class ColumnBase(BaseModel):
    uuid: str
    name: str
    description: str | None = None
    type: str


class Column(ColumnBase):
    class Config:
        orm_mode = True


class TableDetailed(TableBase):
    columns: list[Column] = []

    class Config:
        orm_mode = True
