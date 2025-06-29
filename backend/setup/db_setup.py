import pandas as pd
from setup.config import server, DB_NAME, TABLE_NAME, MOVIE_CSV_PATH

# ─── Format Movie Row ─────────────────────────────────────────────────────
def format_movie(row):
    def safe_int(val, default=0):
        try:
            return int(val)
        except (ValueError, TypeError):
            return default

    def safe_float(val, default=0.0):
        try:
            return float(val)
        except (ValueError, TypeError):
            return default

    return {
        "Title": row.get("Title", ""),
        "Genre": row.get("Genre", ""),
        "Overview": row.get("Overview", ""),
        "Release_Date": pd.to_datetime(row.get("Release_Date", ""), errors='coerce').date(),
        "Popularity": safe_float(row.get("Popularity")),
        "Vote_Count": safe_int(row.get("Vote_Count")),
        "Vote_Average": safe_float(row.get("Vote_Average")),
        "Original_Language": row.get("Original_Language", ""),
        "Poster_Url": row.get("Poster_Url", ""),
    }

# ─── Load and Format Movies Data ─────────────────────────────────────────
def load_movies():
    df = pd.read_csv(MOVIE_CSV_PATH)
    formatted_df = pd.DataFrame([format_movie(row) for _, row in df.iterrows()])

    # Ensure correct types for MindsDB
    formatted_df["Release_Date"] = pd.to_datetime(formatted_df["Release_Date"], errors='coerce')
    formatted_df["Vote_Count"] = formatted_df["Vote_Count"].astype(int)
    formatted_df["Vote_Average"] = formatted_df["Vote_Average"].astype(float)

    return formatted_df

# ─── Setup Table in Files DB ─────────────────────────────────────────────
def setup_table():
    db = server.get_database(DB_NAME)
    movies_df = load_movies()
    try:
        db.create_table(TABLE_NAME, movies_df)
    except Exception as e:
        if "already exists" not in str(e).lower():
            raise e
    return movies_df