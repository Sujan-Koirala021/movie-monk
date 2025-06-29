from fastapi import APIRouter, HTTPException
from setup.config import project, AGENT_NAME, KB_NAME, PROJECT_NAME
from query.models import AskRequest, AskResponse, AskKB, AskKBResponse
import json

router = APIRouter()

@router.post("/ask", response_model=AskResponse)
def ask_agent(request: AskRequest):
    try:
        df = project.query(f"""
            SELECT answer FROM {PROJECT_NAME}.{AGENT_NAME}
            WHERE question = '{request.question}'
            LIMIT 1;
        """).fetch()
        if df.empty:
            return {"answer": "No answer found."}
        return {"answer": df.iloc[0]["answer"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ask-kb", response_model=AskKBResponse)
def ask_kb(request: AskKB):
    try:
        filters = [f"content = '{request.question}'"]

        if request.Vote_Average is not None:
            filters.append(f"Vote_Average = {request.Vote_Average}")

        optional_filters = {
            'Popularity_from': ">=",
            'Popularity_to': "<=",
            'Vote_Count_from': ">=",
            'Vote_Count_to': "<=",
            'Vote_Average_from': ">=",
            'Vote_Average_to': "<="
        }

        for attr, operator in optional_filters.items():
            value = getattr(request, attr, None)
            if value is not None:
                column = attr.rsplit('_', 1)[0]
                filters.append(f"{column} {operator} {value}")

        where_clause = " AND ".join(filters)

        df = project.query(f"""
            SELECT * FROM {PROJECT_NAME}.{KB_NAME}
            WHERE {where_clause}
            LIMIT 10;
        """).fetch()

        if df.empty:
            return {"results": []}

        records = df.to_dict(orient="records")
        for r in records:
            if isinstance(r.get("metadata"), str):
                try:
                    r["metadata"] = json.loads(r["metadata"])
                except:
                    r["metadata"] = {}

        return {"results": records}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

