from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
from typing import List
import numpy as np

from config.settings import settings
from utils import setup_logger
from embeddings import embedding_generator
from vector_db import vector_db
from rag_model import rag_model
from graph_extractor import graph_extractor
from paper_parser import paper_parser
from models import (
    EmbeddingRequest, EmbeddingResponse,
    SemanticSearchRequest, SemanticSearchResponse, SearchResult,
    RAGRequest, RAGResponse,
    GraphRequest, GraphResponse,
    AddPaperRequest,
    HealthResponse, ErrorResponse
)

# Setup logger
logger = setup_logger(__name__)

# Create FastAPI app
app = FastAPI(
    title="PaperNova ML Service",
    description="Machine Learning microservice for PaperNova - AI Research Copilot",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Health & Info Routes ====================

@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint"""
    return {
        "status": "running",
        "message": "PaperNova ML Service is operational",
        "models_loaded": True,
        "vector_db_stats": vector_db.get_stats()
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    try:
        stats = vector_db.get_stats()
        return {
            "status": "healthy",
            "message": "All systems operational",
            "models_loaded": True,
            "vector_db_stats": stats
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
async def get_stats():
    """Get service statistics"""
    return {
        "embedding_model": settings.EMBEDDING_MODEL,
        "embedding_dimension": embedding_generator.get_dimension(),
        "vector_db": vector_db.get_stats(),
        "llm_provider": settings.LLM_PROVIDER
    }

# ==================== Embedding Routes ====================

@app.post("/embeddings/generate", response_model=EmbeddingResponse)
async def generate_embedding(request: EmbeddingRequest):
    """Generate embedding for a single paper"""
    try:
        logger.info(f"Generating embedding for paper: {request.paperId}")
        
        # Generate embedding
        embedding = embedding_generator.generate_embedding(request.text)
        
        # Add to vector database
        metadata = {
            'id': request.paperId,
            'text': request.text[:500]  # Store truncated text
        }
        vector_db.add_embedding(request.paperId, embedding, metadata)
        
        return {
            "embeddingId": request.paperId,
            "dimension": len(embedding),
            "success": True
        }
    except Exception as e:
        logger.error(f"Error generating embedding: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/embeddings/batch")
async def generate_embeddings_batch(papers: List[dict]):
    """Generate embeddings for multiple papers"""
    try:
        logger.info(f"Generating embeddings for {len(papers)} papers")
        
        paper_ids = [p['paperId'] for p in papers]
        texts = [p['text'] for p in papers]
        metadatas = [{'id': p['paperId'], 'text': p['text'][:500]} for p in papers]
        
        # Generate embeddings
        embeddings = embedding_generator.generate_embeddings_batch(texts)
        
        # Add to vector database
        vector_db.add_embeddings_batch(paper_ids, embeddings, metadatas)
        
        return {
            "success": True,
            "count": len(papers),
            "message": f"Generated {len(papers)} embeddings"
        }
    except Exception as e:
        logger.error(f"Error generating batch embeddings: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== Search Routes ====================

@app.post("/search/semantic", response_model=SemanticSearchResponse)
async def semantic_search(request: SemanticSearchRequest):
    """Perform semantic search"""
    try:
        logger.info(f"Semantic search: {request.query}")
        
        # Generate query embedding
        query_embedding = embedding_generator.generate_embedding(request.query)
        
        # Search vector database
        results = vector_db.search(query_embedding, k=request.limit)
        
        # Format results
        search_results = []
        for result in results:
            search_results.append(SearchResult(
                paperId=result['paperId'],
                title=result.get('title', 'Unknown'),
                abstract=result.get('abstract', result.get('text', '')),
                similarity=result['similarity'],
                distance=result['distance']
            ))
        
        return SemanticSearchResponse(
            query=request.query,
            results=search_results,
            count=len(search_results)
        )
    except Exception as e:
        logger.error(f"Error in semantic search: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== RAG Routes ====================

@app.post("/rag/generate", response_model=RAGResponse)
async def generate_answer(request: RAGRequest):
    """Generate answer using RAG"""
    try:
        start_time = time.time()
        logger.info(f"Generating answer for: {request.question}")
        
        # Convert papers to dict format
        papers = [p.dict() for p in request.papers]
        
        # Generate answer
        result = rag_model.generate_answer(request.question, papers)
        
        processing_time = time.time() - start_time
        
        return RAGResponse(
            question=request.question,
            answer=result['answer'],
            citations=result['citations'],
            processing_time=processing_time
        )
    except Exception as e:
        logger.error(f"Error generating answer: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== Graph Routes ====================

@app.post("/graph/extract", response_model=GraphResponse)
async def extract_graph(request: GraphRequest):
    """Extract knowledge graph from papers"""
    try:
        logger.info(f"Extracting graph from {len(request.papers)} papers")
        
        # Convert papers to dict format
        papers = [p.dict() for p in request.papers]
        
        # Extract graph
        graph_data = graph_extractor.extract_graph(papers)
        
        return GraphResponse(
            nodes=graph_data['nodes'],
            edges=graph_data['edges'],
            metadata=graph_data['metadata']
        )
    except Exception as e:
        logger.error(f"Error extracting graph: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== Paper Processing Routes ====================

@app.post("/papers/add")
async def add_paper(request: AddPaperRequest):
    """Add paper to vector database"""
    try:
        logger.info(f"Adding paper: {request.paperId}")
        
        # Create text from metadata
        text = f"{request.metadata.title}. {request.metadata.abstract}"
        
        # Generate embedding
        embedding = embedding_generator.generate_embedding(text)
        
        # Prepare metadata
        metadata = {
            'id': request.paperId,
            'title': request.metadata.title,
            'abstract': request.metadata.abstract,
            'authors': request.metadata.authors,
            'categories': request.metadata.categories
        }
        
        # Add to vector database
        vector_db.add_embedding(request.paperId, embedding, metadata)
        
        return {
            "success": True,
            "paperId": request.paperId,
            "message": "Paper added successfully"
        }
    except Exception as e:
        logger.error(f"Error adding paper: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/papers/parse-pdf")
async def parse_pdf(file: UploadFile = File(...)):
    """Parse PDF file and extract text"""
    try:
        logger.info(f"Parsing PDF: {file.filename}")
        
        # Read PDF
        pdf_bytes = await file.read()
        
        # Parse PDF
        result = paper_parser.parse_pdf(pdf_bytes)
        
        return {
            "success": True,
            "title": result['title'],
            "text": result['text'][:1000] + "...",  # Return truncated
            "num_pages": result['num_pages']
        }
    except Exception as e:
        logger.error(f"Error parsing PDF: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/papers/{paper_id}")
async def get_paper(paper_id: str):
    """Get paper from vector database"""
    try:
        paper = vector_db.get_paper(paper_id)
        if not paper:
            raise HTTPException(status_code=404, detail="Paper not found")
        return paper
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting paper: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== Error Handlers ====================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)}
    )

# ==================== Startup/Shutdown Events ====================

@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info("=" * 60)
    logger.info("PaperNova ML Service Starting...")
    logger.info("=" * 60)
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Embedding Model: {settings.EMBEDDING_MODEL}")
    logger.info(f"LLM Provider: {settings.LLM_PROVIDER}")
    logger.info(f"Vector DB: {vector_db.get_stats()}")
    logger.info("=" * 60)

@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    logger.info("Shutting down PaperNova ML Service...")
    # Save vector database
    try:
        vector_db._save_index()
        logger.info("Vector database saved successfully")
    except Exception as e:
        logger.error(f"Error saving vector database: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development",
        workers=settings.WORKERS
    )