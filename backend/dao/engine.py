from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sqlalchemy as db
from env import load_env

env = load_env()
connect_url = db.engine.url.URL(
    "postgresql+psycopg2",
    username=env["database"]["username"],
    password=env["database"]["password"],
    host=env["database"]["host"],
    port=env["database"]["port"],
    database=env["database"]["database"],
    query=dict()
)
engine = create_engine(connect_url)
Session = sessionmaker(bind=engine)
