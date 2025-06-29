from pydantic import BaseModel
from typing import List, Optional

class AskRequest(BaseModel):
    question: str

class AskResponse(BaseModel):
    answer: str

class AskKB(BaseModel):
    question: str
    Vote_Average: Optional[float] = None
    Release_Date_from: Optional[str] = None
    Release_Date_to: Optional[str] = None
    Popularity_from: Optional[float] = None
    Popularity_to: Optional[float] = None
    Vote_Count_from: Optional[int] = None
    Vote_Count_to: Optional[int] = None
    Vote_Average_from: Optional[float] = None
    Vote_Average_to: Optional[float] = None

class Result(BaseModel):
    id: str
    chunk_id: str
    chunk_content: str
    metadata: dict
    relevance: float | None = None
    distance: float | None = None

class AskKBResponse(BaseModel):
    results: List[Result]