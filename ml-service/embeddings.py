import numpy as np
from typing import List, Union
from sentence_transformers import SentenceTransformer
from config.settings import settings
from utils import setup_logger

logger = setup_logger(__name__)

class EmbeddingGenerator:
    """Generate embeddings using Sentence Transformers"""
    
    def __init__(self):
        self.model = None
        self.model_name = settings.EMBEDDING_MODEL
        self._load_model()
    
    def _load_model(self):
        """Load the sentence transformer model"""
        try:
            logger.info(f"Loading embedding model: {self.model_name}")
            self.model = SentenceTransformer(self.model_name)
            logger.info(f"Model loaded successfully. Embedding dimension: {self.model.get_sentence_embedding_dimension()}")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise
    
    def generate_embedding(self, text: str) -> np.ndarray:
        """
        Generate embedding for a single text
        
        Args:
            text: Input text string
            
        Returns:
            numpy array of embeddings
        """
        try:
            # Truncate if too long
            if len(text) > settings.MAX_SEQUENCE_LENGTH * 4:  # Rough char estimate
                text = text[:settings.MAX_SEQUENCE_LENGTH * 4]
            
            embedding = self.model.encode(text, convert_to_numpy=True)
            return embedding
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            raise
    
    def generate_embeddings_batch(self, texts: List[str]) -> np.ndarray:
        """
        Generate embeddings for multiple texts
        
        Args:
            texts: List of text strings
            
        Returns:
            numpy array of embeddings (batch_size x embedding_dim)
        """
        try:
            # Truncate texts if needed
            truncated_texts = []
            for text in texts:
                if len(text) > settings.MAX_SEQUENCE_LENGTH * 4:
                    text = text[:settings.MAX_SEQUENCE_LENGTH * 4]
                truncated_texts.append(text)
            
            embeddings = self.model.encode(
                truncated_texts,
                convert_to_numpy=True,
                show_progress_bar=len(texts) > 10
            )
            return embeddings
        except Exception as e:
            logger.error(f"Error generating batch embeddings: {e}")
            raise
    
    def get_dimension(self) -> int:
        """Get embedding dimension"""
        return self.model.get_sentence_embedding_dimension()

# Global instance
embedding_generator = EmbeddingGenerator()
