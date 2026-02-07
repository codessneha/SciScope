from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# ==================== Embedding Models ====================

class EmbeddingRequest(BaseModel):
    """Request model for generating embeddings"""
    paperId: str = Field(..., description="Unique paper identifier")
    text: str = Field(..., description="Text to generate embedding for")

class EmbeddingResponse(BaseModel):
    """Response model for embedding generation"""
    embeddingId: str = Field(..., description="Embedding identifier (same as paperId)")
    dimension: int = Field(..., description="Embedding dimension")
    success: bool = Field(default=True)

class BatchEmbeddingRequest(BaseModel):
    """Request model for batch embedding generation"""
    papers: List[Dict[str, str]] = Field(..., description="List of papers with id and text")

# ==================== Search Models ====================

class SemanticSearchRequest(BaseModel):
    """Request model for semantic search"""
    query: str = Field(..., description="Search query")
    limit: int = Field(default=10, ge=1, le=100, description="Number of results")

class SearchResult(BaseModel):
    """Individual search result"""
    paperId: str
    title: str
    abstract: str
    similarity: float
    distance: float

class SemanticSearchResponse(BaseModel):
    """Response model for semantic search"""
    query: str
    results: List[SearchResult]
    count: int

# ==================== RAG Models ====================

class PaperInput(BaseModel):
    """Paper input for RAG"""
    id: str
    title: str
    abstract: str
    authors: Optional[List[str]] = []

class Citation(BaseModel):
    """Citation information"""
    paperId: Optional[str] = None
    text: str
    relevance: float

class RAGRequest(BaseModel):
    """Request model for RAG answer generation"""
    question: str = Field(..., description="Question to answer")
    papers: List[PaperInput] = Field(..., description="Papers to use as context")

class RAGResponse(BaseModel):
    """Response model for RAG answer"""
    question: str
    answer: str
    citations: List[Citation]
    processing_time: Optional[float] = None

# ==================== Graph Models ====================

class GraphNode(BaseModel):
    """Knowledge graph node"""
    id: str
    label: str
    type: str  # paper, author, concept, method, keyword
    data: Dict[str, Any] = {}

class GraphEdge(BaseModel):
    """Knowledge graph edge"""
    source: str
    target: str
    type: str  # authored_by, uses_method, related_to, has_keyword
    weight: float = 1.0

class GraphMetadata(BaseModel):
    """Graph metadata"""
    paperCount: int = 0
    authorCount: int = 0
    conceptCount: int = 0

class GraphRequest(BaseModel):
    """Request model for graph extraction"""
    papers: List[PaperInput]

class GraphResponse(BaseModel):
    """Response model for graph extraction"""
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    metadata: GraphMetadata

# ==================== Paper Models ====================

class PaperMetadata(BaseModel):
    """Paper metadata"""
    title: str
    abstract: str
    authors: Optional[List[str]] = []
    categories: Optional[List[str]] = []

class AddPaperRequest(BaseModel):
    """Request to add paper to vector database"""
    paperId: str
    metadata: PaperMetadata

# ==================== Generic Response Models ====================

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    message: str
    models_loaded: bool
    vector_db_stats: Dict[str, Any]

class ErrorResponse(BaseModel):
    """Error response"""
    error: str
    detail: Optional[str] = None