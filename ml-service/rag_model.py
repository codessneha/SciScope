import torch
from typing import List, Dict
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from config.settings import settings
from utils import setup_logger

logger = setup_logger(__name__)

class RAGModel:
    """RAG-based question answering system"""
    
    def __init__(self):
        self.provider = settings.LLM_PROVIDER
        self.model = None
        self.tokenizer = None
        
        if self.provider == "huggingface":
            self._load_hf_model()
    
    def _load_hf_model(self):
        """Load HuggingFace model for text generation"""
        try:
            logger.info(f"Loading HuggingFace model: {settings.HF_MODEL}")
            self.tokenizer = AutoTokenizer.from_pretrained(settings.HF_MODEL)
            self.model = AutoModelForSeq2SeqLM.from_pretrained(settings.HF_MODEL)
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading HuggingFace model: {e}")
            logger.warning("Falling back to simple provider")
            self.provider = "simple"
    
    def generate_answer(self, question: str, papers: List[Dict]) -> Dict:
        """
        Generate answer based on question and papers
        
        Args:
            question: User question
            papers: List of paper dicts with title, abstract, etc.
            
        Returns:
            Dict with answer and citations
        """
        try:
            # Build context from papers
            context = self._build_context(papers)
            
            # Generate answer based on provider
            if self.provider == "huggingface" and self.model:
                answer = self._generate_with_hf(question, context)
            else:
                answer = self._generate_simple(question, papers)
            
            # Extract citations
            citations = self._extract_citations(papers, answer)
            
            return {
                'answer': answer,
                'citations': citations
            }
        except Exception as e:
            logger.error(f"Error generating answer: {e}")
            raise
    
    def _build_context(self, papers: List[Dict], max_length: int = 2000) -> str:
        """Build context from paper abstracts"""
        context_parts = []
        current_length = 0
        
        for i, paper in enumerate(papers):
            title = paper.get('title', '')
            abstract = paper.get('abstract', '')
            
            paper_text = f"Paper {i+1}: {title}\n{abstract}\n\n"
            
            if current_length + len(paper_text) > max_length:
                break
            
            context_parts.append(paper_text)
            current_length += len(paper_text)
        
        return "".join(context_parts)
    
    def _generate_with_hf(self, question: str, context: str) -> str:
        """Generate answer using HuggingFace model"""
        try:
            prompt = f"""Answer the following question based on the provided research papers.

Context:
{context}

Question: {question}

Answer:"""
            
            inputs = self.tokenizer(prompt, return_tensors="pt", max_length=512, truncation=True)
            
            outputs = self.model.generate(
                inputs.input_ids,
                max_length=256,
                num_beams=4,
                early_stopping=True,
                temperature=0.7
            )
            
            answer = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            return answer
        except Exception as e:
            logger.error(f"Error in HF generation: {e}")
            return self._generate_simple(question, context)
    
    def _generate_simple(self, question: str, papers: List[Dict]) -> str:
        """
        Simple rule-based answer generation
        (This is a fallback - in production you'd use a proper LLM)
        """
        # Extract key information from papers
        findings = []
        methods = []
        
        for paper in papers[:3]:  # Top 3 papers
            abstract = paper.get('abstract', '')
            title = paper.get('title', '')
            
            # Simple extraction (can be improved with NLP)
            findings.append(f"According to '{title}': {abstract[:200]}...")
        
        # Build answer
        answer = f"Based on the research papers:\n\n"
        answer += "\n\n".join(findings)
        answer += f"\n\nThese papers collectively address aspects of: {question}"
        
        return answer
    
    def _extract_citations(self, papers: List[Dict], answer: str) -> List[Dict]:
        """Extract citations from papers used in answer"""
        citations = []
        
        for i, paper in enumerate(papers[:3]):  # Top 3 most relevant
            citation = {
                'paperId': paper.get('id'),
                'text': paper.get('abstract', '')[:200] + "...",
                'relevance': 1.0 - (i * 0.2)  # Simple relevance scoring
            }
            citations.append(citation)
        
        return citations

# Global instance
rag_model = RAGModel()