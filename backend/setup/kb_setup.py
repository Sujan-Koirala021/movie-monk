from setup.config import KB_NAME, GEMINI_API_KEY, DB_NAME, TABLE_NAME, server, PROJECT_NAME
from setup.db_setup import load_movies

def run_query(query):
    return server.query(query).fetch()

def setup_kb():
    query = f"""
    CREATE KNOWLEDGE_BASE IF NOT EXISTS {PROJECT_NAME}.{KB_NAME}
    USING
        embedding_model = {{
            "provider": "gemini",
            "model_name": "text-embedding-004",
            "api_key": "{GEMINI_API_KEY}"
        }},
        reranking_model = {{
            "provider": "gemini",
            "model_name": "gemini-2.5-flash",
            "api_key": "{GEMINI_API_KEY}"
        }},
        metadata_columns = ['Release_Date','Popularity','Vote_Count','Vote_Average','Original_Language','Poster_Url'],
        content_columns = ['Title','Genre','Overview'],
        id_column = 'Title';
    """
    run_query(query)

def populate_kb():
    movies_df = load_movies()

    def kb_has_data():
        try:
            df = run_query(f"SELECT COUNT(*) as cnt FROM {PROJECT_NAME}.{KB_NAME};")
            return df.iloc[0]['cnt'] > 0
        except:
            return False

    if kb_has_data():
        print("Knowledge base already has data, skipping insertion.")
        return

    print("Inserting data using batched insert...")
    query = f"""
    INSERT INTO {PROJECT_NAME}.{KB_NAME}
    SELECT Title, Genre, Overview, Release_Date, Popularity, Vote_Count, Vote_Average, Original_Language, Poster_Url
    FROM {DB_NAME}.{TABLE_NAME}
    USING
        batch_size = 45,
        track_column = Title,
        threads = 4,
        error = 'skip';
    """
    run_query(query)

