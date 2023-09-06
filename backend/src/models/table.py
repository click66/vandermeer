from sqlalchemy import Column, String, Uuid
from sqlalchemy.orm import relationship


class Table():
    _uuid = Column(Uuid, primary_key=True, index=True)
    _database_name = Column(String)
    _name = Column(String)
    _description = Column(String)


class Column():
    _uuid = Column(Uuid, primary_key=True, index=True)
    _name = Column(String)
    _description = Column(String)
    _type = Column(String)

    table = relationship('Table', back_populates='columns')
