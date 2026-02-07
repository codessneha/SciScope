import os
from pathlib import Path
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 1
    ENVIRONMENT: str = "development"
    
    # Paths
    BASE_DIR: Path = Path(__file__).parent.parent
    DATA_DIR: Path = BASE_DIR / "data"
    EMBEDDINGS_DIR: Path = DATA_DIR / "embeddings"
    VECTORS_DIR: Path = DATA_DIR / "vectors"
    MODELS_DIR: Path = BASE_DIR / "models"
    
    # Model Configuration
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    MAX_SEQUENCE_LENGTH: int = 512
    EMBEDDING_DIMENSION: int = 384  # for all-MiniLM-L6-v2
    
    # Vector Database
    FAISS_INDEX_PATH: str = "./data/vectors/faiss_index.bin"
    EMBEDDING_METADATA_PATH: str = "./data/embeddings/metadata.json"
    
    # LLM Configuration
    LLM_PROVIDER: str = "simple"
    HF_MODEL: str = "google/flan-t5-base"
    
    # API Keys
    OPENAI_API_KEY: Optional[str] = None
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

    def create_directories(self):
        """Create necessary directories if they don't exist"""
        self.DATA_DIR.mkdir(parents=True, exist_ok=True)
        self.EMBEDDINGS_DIR.mkdir(parents=True, exist_ok=True)
        self.VECTORS_DIR.mkdir(parents=True, exist_ok=True)
        self.MODELS_DIR.mkdir(parents=True, exist_ok=True)

settings = Settings()
settings.create_directories()