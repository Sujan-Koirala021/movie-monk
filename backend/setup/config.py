import os
from dotenv import load_dotenv
from mindsdb_sdk import connect

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
MOVIE_CSV_PATH = os.path.abspath('./movierecommendation.csv')
GOOGLE_SHEET= os.getenv('GOOGLE_SHEET_ID')
SHEET_NAME='Sheet1'
NEW_DATASOURCE_NAME= 'new_datasource'

PROJECT_NAME = 'movie_recommender'
DB_NAME = 'files'
JOB_NAME = 'update_movie_kb_job'
TABLE_NAME = 'movies_data'
KB_NAME = 'movies_kb'
AGENT_NAME = 'movies_agent'

server = connect()
project = server.get_project(PROJECT_NAME) if PROJECT_NAME in [p.name for p in server.list_projects()] else server.create_project(PROJECT_NAME)
