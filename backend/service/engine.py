from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sqlalchemy as db

connect_url = db.engine.url.URL(
    "mysql+pymysql",
    username="root",
    password="123581321Ba@",
    host="120.46.212.185",
    port=3306,
    database="taxi",
    query=dict(charset="utf8mb4"),
)
engine = create_engine(connect_url)
Session = sessionmaker(bind=engine)
