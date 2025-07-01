# 🎬 MovieMonk – AI-Powered Movie Recommendation App (Using MindsDB KB + Agent)

MovieMonk helps you discover your next favorite movie using the power of **semantic search** and **AI Agents** from [MindsDB](https://mindsdb.com).

> Ask natural language questions like:
> “Show me top-rated sci-fi movies after 2015 with high popularity”
> and get rich, filtered recommendations with posters, overviews, and ratings.

## ✨ Key Features (MindsDB)

- **🔎 Semantic Search with Knowledge Base**  
  Uses MindsDB’s `Knowledge Base` to perform semantic search on movie data (`Title`, `Genre`, `Overview`) for natural language queries.

- **🎯 Metadata Filtering**  
  Supports SQL-style filtering using metadata columns like `Vote_Average`, `Popularity`, `Release_Date`, and `Vote_Count`.

- **🧠 AI Agent Integration**  
  Integrated with a MindsDB `Agent` using `CREATE AGENT`, which responds to user queries with contextual, conversational movie recommendations.

- **⚙️ Prompt Customization**  
  Agent prompt is fully customized to behave like a witty movie expert — all configured within MindsDB’s agent creation syntax.

- **📈 KB Evaluation Support**  
  Utilizes MindsDB’s `EVALUATE KNOWLEDGE_BASE` to test and measure the accuracy and relevance of semantic search results.

## Demo Video
[![Watch the video](https://img.youtube.com/vi/Jo95vSNnoxg/0.jpg)](https://youtu.be/Jo95vSNnoxg)

## Dev.to URL
https://dev.to/sujankoirala021/moviemonk-an-ai-powered-movie-recommendation-app-using-mindsdb-knowledge-base-agent-2if

## Dependencies
- React
- Tailwind
- Fast API
- Vite
- MindsDB
- Docker Desktop

## Getting Started

### Installation

#### Clone the repository:
```bash
git clone https://github.com/Sujan-Koirala021/movie_monk
```

### MindsDB Installation/Setup
Run this command to create a Docker container with MindsDB:
```bash
docker run --name mindsdb_container -e MINDSDB_APIS=http,mysql -p 47334:47334 -p 47335:47335 mindsdb/mindsdb
```


### Frontend Setup 

#### Navigate to the frontend directory:
```bash
cd frontend
```

#### Install dependencies:
```bash
npm install
```

#### Start the  server:
```bash
npm run dev
```

## Backend Setup
### Navigate to the backend directory:
```bash
cd ../backend
```
### Create your own .env file under backend directory

```bash
GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
GOOGLE_SHEET_ID=<YOUR_GOOGLE_SHEET_ID>
```
Note that EVALUATE JOBS makes use of csv data from Google sheet to update for changes in knowledge base.

### Create and Activate  Virtual Environment
```bash
python -m venv env
```

```bash
source env/bin/activate
```
For windows,
```bash
.\env\Scripts\activate
```
### Install dependencies
```bash
pip install -r requirements.txt
```

### Setup Knowledge Base
```bash
python all_setup.py
```

### Start the backend server
```bash
uvicorn app:app --reload
```

### Additional Configuratiosn:
#### Evaulate the model 
Use the provided evaluate.py script inside the backend directory to evaluate your MindsDB Knowledge Base using a CSV file of test data.
Inside backend folder
```bash
python evaluate.py movies_sample_test.csv --save results.csv --table-name movie_test_data
```
#### Create jobs
Use the provided job_setup.py script inside the backend/setup directory to create job for your MindsDB Knowledge Base
```bash
python job_setup.py
```
#### Positional Argument

- `csv_file`: **(Required)**  
  Path to the CSV file containing test data.

  The CSV must include the following **two columns**:
  - `question`: The input query to be tested against the knowledge base.
  - `doc_id`: The expected document identifier (ground truth) used to verify LLM accuracy.

#### Optional Arguments

- `--save` *(optional)*  
  Path to the output CSV file where evaluation results will be stored.  
  - **Default:** `evaluate_result.csv`  
  - If the file already exists, new results will be **appended** with a `timestamp` column.

- `--table-name` *(optional)*  
  Name to assign to the MindsDB table created from the input CSV.  
  - **Default:** `movie_test_data`

## Usage

#### Visit the  application:
Open your browser and navigate to `http://localhost:5173/`.


### 🧠 Working with MindsDB

This project uses MindsDB to power intelligent movie recommendations via Knowledge Bases and Agents. Below is how MindsDB was integrated at each step.

---

### 1️⃣ Data Connection & Integration

- Connected to MindsDB using the Python SDK.
- Loaded movie data from `movierecommendation.csv`.
- Parsed and cleaned fields like `Release_Date`, `Vote_Count`, and `Vote_Average` to ensure correct types.
- Created a table in MindsDB's `files` database and inserted the cleaned data.

---

### 2️⃣ Knowledge Base Creation

- Created a Knowledge Base (`movies_kb`) from the uploaded movie data.
- Inserted (`movierecommendation.csv`) data to Knowledge Base.
- Used semantic columns: `Title`, `Genre`, `Overview` for embedding and search.
- Defined metadata columns like `Vote_Average`, `Popularity`, `Release_Date`, `Vote_Count`, and `Original_Language` for SQL-style filtering.
- ChromaDB for index creation.

```sql
CREATE KNOWLEDGE_BASE IF NOT EXISTS movie_recommender.movies_kb
USING
    embedding_model = {
        "provider": "gemini",
        "model_name": "text-embedding-004",
        "api_key": "<GEMINI_API_KEY>"
    },
    reranking_model = {
        "provider": "gemini",
        "model_name": "gemini-2.5-flash",
        "api_key": "<GEMINI_API_KEY>"
    },
    metadata_columns = ['Release_Date','Popularity','Vote_Count','Vote_Average','Original_Language','Poster_Url'],
    content_columns = ['Title','Genre','Overview'],
    id_column = 'Title';

```

---

### 3️⃣ AI Agent Creation

- Created an Agent (`movies_agent`) using `CREATE AGENT` in MindsDB.
- Model used: `gemini-2.0-flash`.
- Agent prompt was customized to respond like a friendly movie expert.
- The Agent was connected to the `movies_kb` to retrieve semantically relevant movie suggestions.
- Handled fallback logic for when KB results are empty or no good match is found.

```sql
CREATE AGENT IF NOT EXISTS movie_recommender.movies_agent
USING
    model = 'gemini-2.0-flash',
    gemini_api_key = '<GEMINI_API_KEY>',
    include_knowledge_bases = ['movie_recommender.movies_kb'],
    prompt_template = '<YOUR_ESCAPED_PROMPT>';
```
---

### 4️⃣ Query Processing Pipeline

- Created two FastAPI endpoints:
  - `/ask`: Sends a natural language question to the Agent and returns a response.
  - `/ask-kb`: Directly queries the Knowledge Base using semantic + metadata filtering.
- Backend logic constructs appropriate SQL queries based on user input and sends them to MindsDB using `.query()`.
- JSON responses are returned to the frontend with relevant movie data, including title, overview, rating, and poster URL.
- Optionally used `EVALUATE KNOWLEDGE_BASE` to assess the quality of KB results.

## ✅ Project Checklist

- **CREATE KNOWLEDGE_BASE** used to initialize KB (`movies_kb`)
- 📥 **INSERT INTO knowledge_base** used to ingest movie data (used `movies_data` from `movierecommendation.csv`) (file: `backend/setup/kb_setup.py`)
- 🔍 **SELECT ... WHERE content LIKE '<query>'** used for semantic search (used in `/ask-kb` endpoint file:`backend>query>handler.py`)
- 🧠 **CREATE INDEX ON KNOWLEDGE_BASE** auto-created via ChromaDB 
- 🗂️ **metadata_columns** defined and used for attribute filtering (`Vote_Average`, `Popularity`, `Release_Date`, `Vote_Count`, and `Original_Language` columns)
- ⏱️ **JOBS** used to periodically sync new data into the KB 
- 🔄 **MindsDB Agent** integrated to use KB results in generation (`movies_agent`)(used in `/ask` endpoint file:`backend>query>handler.py`)
- 🤖 **AI Table OR Agent Workflow** built agent using KB(`movies_agent`) (file: `backend/setup/agent_setup.py`)
- 🎯 **EVALUATE KNOWLEDGE_BASE** used to test relevancy/accuracy (`backend/evaluate.py`)
- 🎥 Video demo uploaded showcasing KB features
- 📝 README includes setup instructions and usage guide
- ✍️ Dev post published explaining the app and use cases
- 💬 Feedback submitted with feature suggestions

## Contributing

1. Fork the repo  
2. Create a feature branch  
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes
   ```bash
   git commit -m "Add YourFeature"
   ```
4. Push
   ```bash
   git push origin feature/YourFeature
   ```   
5. Open a pull request
