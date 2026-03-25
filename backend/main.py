"""
FastAPI Backend to serve the RAG pipelines to the React frontend.
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# These imports will work perfectly as long as we run uvicorn from the root folder
from src.corpus import load_index
from src.pipelines.rag_fusion import run_rag_fusion
from src.pipelines.hyde import run_hyde
from src.pipelines.crag import run_crag
from src.pipelines.graph_rag import run_graph_rag

app = FastAPI(title="RAG Evaluation API")

# Allow the Vite React frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable to hold our index in memory
INDEX = None
# Path is relative to the root directory where we will execute the script
INDEX_PATH = "dataset/global_index.pkl"

@app.on_event("startup")
def startup_event():
    """Loads the pre-built index into memory when the server starts."""
    global INDEX
    if os.path.exists(INDEX_PATH):
        print(f"Loading global index from {INDEX_PATH} into memory...")
        INDEX = load_index(INDEX_PATH)
    else:
        print(f"Warning: Index not found at {INDEX_PATH}. Please run run_evaluation.py first.")

class QueryRequest(BaseModel):
    query: str
    pipeline: str

@app.post("/query")
def process_query(req: QueryRequest):
    """
    Endpoint to process a user query using the selected RAG pipeline.
    """
    if INDEX is None:
        raise HTTPException(status_code=500, detail="Global index not loaded.")
        
    query = req.query
    pipeline = req.pipeline
    
    try:
        if pipeline == "rag_fusion":
            ans, ctx, score = run_rag_fusion(query, INDEX)
        elif pipeline == "hyde":
            ans, ctx, score = run_hyde(query, INDEX)
        elif pipeline == "crag":
            ans, ctx, score = run_crag(query, INDEX)
        elif pipeline == "graph_rag":
            ans, ctx, score = run_graph_rag(query, INDEX)
        else:
            raise HTTPException(status_code=400, detail="Invalid pipeline selected.")
            
        return {
            "answer": ans,
            "context": ctx,
            "score": score
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)