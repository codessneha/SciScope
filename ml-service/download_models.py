"""
Download and cache models before first run
"""

from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from config.settings import settings
from utils import setup_logger

logger = setup_logger(__name__)

def download_embedding_model():
    """Download embedding model"""
    logger.info(f"Downloading embedding model: {settings.EMBEDDING_MODEL}")
    try:
        model = SentenceTransformer(settings.EMBEDDING_MODEL)
        logger.info("✅ Embedding model downloaded successfully")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to download embedding model: {e}")
        return False

def download_llm_model():
    """Download LLM model if using HuggingFace"""
    if settings.LLM_PROVIDER != "huggingface":
        logger.info("Skipping LLM download (not using HuggingFace)")
        return True
    
    logger.info(f"Downloading LLM model: {settings.HF_MODEL}")
    try:
        tokenizer = AutoTokenizer.from_pretrained(settings.HF_MODEL)
        model = AutoModelForSeq2SeqLM.from_pretrained(settings.HF_MODEL)
        logger.info("✅ LLM model downloaded successfully")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to download LLM model: {e}")
        return False

def main():
    logger.info("=" * 60)
    logger.info("Downloading ML Models")
    logger.info("=" * 60)
    
    success = True
    
    # Download embedding model
    if not download_embedding_model():
        success = False
    
    # Download LLM model
    if not download_llm_model():
        success = False
    
    logger.info("=" * 60)
    if success:
        logger.info("✅ All models downloaded successfully")
    else:
        logger.info("❌ Some models failed to download")
    logger.info("=" * 60)

if __name__ == "__main__":
    main()