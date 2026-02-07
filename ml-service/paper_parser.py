import re
from typing import Dict, Optional
from PyPDF2 import PdfReader
from io import BytesIO
from utils import setup_logger

logger = setup_logger(__name__)

class PaperParser:
    """Parse research papers (PDF and text)"""
    
    def parse_pdf(self, pdf_bytes: bytes) -> Dict:
        """
        Parse PDF and extract text
        
        Args:
            pdf_bytes: PDF file as bytes
            
        Returns:
            Dict with extracted text and metadata
        """
        try:
            pdf_file = BytesIO(pdf_bytes)
            reader = PdfReader(pdf_file)
            
            # Extract text from all pages
            text_parts = []
            for page in reader.pages:
                text_parts.append(page.extract_text())
            
            full_text = "\n".join(text_parts)
            
            # Try to extract title (usually in first page)
            title = self._extract_title(text_parts[0] if text_parts else "")
            
            return {
                'text': full_text,
                'title': title,
                'num_pages': len(reader.pages)
            }
        except Exception as e:
            logger.error(f"Error parsing PDF: {e}")
            raise
    
    def _extract_title(self, first_page: str) -> str:
        """Extract title from first page (heuristic)"""
        # Split into lines
        lines = first_page.split('\n')
        
        # Title is usually one of the first few lines
        # and typically all caps or title case
        for line in lines[:10]:
            line = line.strip()
            if len(line) > 20 and len(line) < 200:
                # Check if it looks like a title
                if line.isupper() or line.istitle():
                    return line
        
        # Fallback: return first substantial line
        for line in lines[:5]:
            line = line.strip()
            if len(line) > 20:
                return line
        
        return "Unknown Title"
    
    def extract_abstract(self, text: str) -> Optional[str]:
        """Extract abstract from paper text"""
        # Look for abstract section
        abstract_pattern = r'abstract[:\s]+(.*?)(?:introduction|keywords|1\.|$)'
        match = re.search(abstract_pattern, text.lower(), re.DOTALL | re.IGNORECASE)
        
        if match:
            abstract = match.group(1).strip()
            # Clean up
            abstract = re.sub(r'\s+', ' ', abstract)
            return abstract[:1000]  # Limit length
        
        return None

# Global instance
paper_parser = PaperParser()