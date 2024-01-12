from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sqlalchemy as db

connect_url = db.engine.url.URL(
    "postgresql+psycopg2",
    username="lhabc",
    password="123581321Ba@",
    host="120.46.212.185",
    port=5432,
    database="taxi",
    query=dict()
)
engine = create_engine(connect_url)
Session = sessionmaker(bind=engine)
