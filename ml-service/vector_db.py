import faiss
import numpy as np
import json
import os
from typing import List, Dict, Tuple, Optional
from pathlib import Path
from config.settings import settings
from utils import setup_logger

logger = setup_logger(__name__)

class VectorDatabase:
    """FAISS-based vector database for semantic search"""
    
    def __init__(self):
        self.dimension = settings.EMBEDDING_DIMENSION
        self.index = None
        self.metadata = {}  # paperId -> metadata mapping
        self.id_to_index = {}  # paperId -> index position
        self.index_to_id = {}  # index position -> paperId
        self.current_index = 0
        
        self.index_path = Path(settings.FAISS_INDEX_PATH)
        self.metadata_path = Path(settings.EMBEDDING_METADATA_PATH)
        
        self._initialize_index()
    
    def _initialize_index(self):
        """Initialize or load FAISS index"""
        if self.index_path.exists():
            logger.info("Loading existing FAISS index...")
            self._load_index()
        else:
            logger.info("Creating new FAISS index...")
            self._create_index()
    
    def _create_index(self):
        """Create a new FAISS index"""
        # Using L2 distance (can be changed to inner product for cosine similarity)
        self.index = faiss.IndexFlatL2(self.dimension)
        logger.info(f"Created FAISS index with dimension {self.dimension}")
    
    def _save_index(self):
        """Save FAISS index and metadata to disk"""
        try:
            # Save FAISS index
            faiss.write_index(self.index, str(self.index_path))
            
            # Save metadata
            metadata_dict = {
                'metadata': self.metadata,
                'id_to_index': self.id_to_index,
                'index_to_id': {str(k): v for k, v in self.index_to_id.items()},
                'current_index': self.current_index
            }
            
            with open(self.metadata_path, 'w') as f:
                json.dump(metadata_dict, f, indent=2)
            
            logger.info(f"Saved index with {self.index.ntotal} vectors")
        except Exception as e:
            logger.error(f"Error saving index: {e}")
            raise
    
    def _load_index(self):
        """Load FAISS index and metadata from disk"""
        try:
            # Load FAISS index
            self.index = faiss.read_index(str(self.index_path))
            
            # Load metadata
            if self.metadata_path.exists():
                with open(self.metadata_path, 'r') as f:
                    data = json.load(f)
                    self.metadata = data.get('metadata', {})
                    self.id_to_index = data.get('id_to_index', {})
                    self.index_to_id = {int(k): v for k, v in data.get('index_to_id', {}).items()}
                    self.current_index = data.get('current_index', 0)
            
            logger.info(f"Loaded index with {self.index.ntotal} vectors")
        except Exception as e:
            logger.error(f"Error loading index: {e}")
            self._create_index()
    
    def add_embedding(self, paper_id: str, embedding: np.ndarray, metadata: Dict):
        """
        Add a single embedding to the index
        
        Args:
            paper_id: Unique identifier for the paper
            embedding: Embedding vector
            metadata: Paper metadata (title, abstract, etc.)
        """
        try:
            # Check if already exists
            if paper_id in self.id_to_index:
                logger.warning(f"Paper {paper_id} already exists in index")
                return
            
            # Ensure embedding is 2D
            if embedding.ndim == 1:
                embedding = embedding.reshape(1, -1)
            
            # Add to FAISS index
            self.index.add(embedding.astype('float32'))
            
            # Update mappings
            self.id_to_index[paper_id] = self.current_index
            self.index_to_id[self.current_index] = paper_id
            self.metadata[paper_id] = metadata
            self.current_index += 1
            
            # Save periodically
            if self.current_index % 10 == 0:
                self._save_index()
            
            logger.info(f"Added embedding for paper {paper_id}")
        except Exception as e:
            logger.error(f"Error adding embedding: {e}")
            raise
    
    def add_embeddings_batch(self, paper_ids: List[str], embeddings: np.ndarray, metadatas: List[Dict]):
        """
        Add multiple embeddings to the index
        
        Args:
            paper_ids: List of paper IDs
            embeddings: Batch of embedding vectors
            metadatas: List of metadata dicts
        """
        try:
            for paper_id, embedding, metadata in zip(paper_ids, embeddings, metadatas):
                if paper_id not in self.id_to_index:
                    self.add_embedding(paper_id, embedding, metadata)
            
            self._save_index()
            logger.info(f"Added {len(paper_ids)} embeddings to index")
        except Exception as e:
            logger.error(f"Error adding batch embeddings: {e}")
            raise
    
    def search(self, query_embedding: np.ndarray, k: int = 10) -> List[Dict]:
        """
        Search for similar papers
        
        Args:
            query_embedding: Query embedding vector
            k: Number of results to return
            
        Returns:
            List of dicts with paper info and similarity scores
        """
        try:
            if self.index.ntotal == 0:
                logger.warning("Index is empty")
                return []
            
            # Ensure embedding is 2D
            if query_embedding.ndim == 1:
                query_embedding = query_embedding.reshape(1, -1)
            
            # Search
            k = min(k, self.index.ntotal)
            distances, indices = self.index.search(query_embedding.astype('float32'), k)
            
            # Format results
            results = []
            for dist, idx in zip(distances[0], indices[0]):
                if idx == -1:  # FAISS returns -1 for invalid results
                    continue
                
                paper_id = self.index_to_id.get(int(idx))
                if paper_id:
                    metadata = self.metadata.get(paper_id, {})
                    results.append({
                        'paperId': paper_id,
                        'distance': float(dist),
                        'similarity': float(1 / (1 + dist)),  # Convert distance to similarity
                        **metadata
                    })
            
            return results
        except Exception as e:
            logger.error(f"Error searching index: {e}")
            raise
    
    def get_paper(self, paper_id: str) -> Optional[Dict]:
        """Get paper metadata by ID"""
        return self.metadata.get(paper_id)
    
    def remove_paper(self, paper_id: str):
        """Remove a paper from the index (requires rebuild)"""
        # Note: FAISS doesn't support direct deletion
        # Would need to rebuild index without this paper
        if paper_id in self.metadata:
            del self.metadata[paper_id]
            logger.info(f"Removed metadata for paper {paper_id}. Note: Vector still in index.")
    
    def get_stats(self) -> Dict:
        """Get database statistics"""
        return {
            'total_papers': len(self.metadata),
            'index_size': self.index.ntotal if self.index else 0,
            'dimension': self.dimension
        }

# Global instance
vector_db = VectorDatabase()