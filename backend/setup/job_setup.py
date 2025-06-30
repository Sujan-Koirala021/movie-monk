from config import (
    KB_NAME,
    server,
    PROJECT_NAME,
    GOOGLE_SHEET,
    SHEET_NAME,
    NEW_DATASOURCE_NAME,
    JOB_NAME
)

def run_query(query):
    return server.query(query).fetch()


def new_datasource():
    query = f"""
    CREATE DATABASE {NEW_DATASOURCE_NAME}
    WITH
    engine = 'sheets',
    parameters = {{
        "spreadsheet_id": "{GOOGLE_SHEET}",
        "sheet_name": "{SHEET_NAME}"
    }};
    """
    run_query(query)


def setup_job():
    query = f"""
    CREATE JOB {JOB_NAME} (
        INSERT INTO {PROJECT_NAME}.{KB_NAME} (
            SELECT *
            FROM {PROJECT_NAME}.{NEW_DATASOURCE_NAME}.{SHEET_NAME}
            WHERE id > COALESCE(LAST, 0)
        )
    )
    EVERY 6 hours
    IF (
        SELECT *
        FROM {PROJECT_NAME}.{NEW_DATASOURCE_NAME}.{SHEET_NAME}
        WHERE id > COALESCE(LAST, 0)
    );
    """
    run_query(query)


if __name__ == "__main__":
    new_datasource()
    setup_job()
