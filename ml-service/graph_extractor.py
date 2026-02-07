import re
from typing import List, Dict, Set
from collections import Counter
from utils import setup_logger

logger = setup_logger(__name__)

class GraphExtractor:
    """Extract knowledge graph from papers"""
    
    def __init__(self):
        # Common ML/CS keywords to extract
        self.method_keywords = [
            'neural network', 'deep learning', 'machine learning', 'reinforcement learning',
            'supervised learning', 'unsupervised learning', 'cnn', 'rnn', 'lstm', 'gru',
            'transformer', 'attention', 'bert', 'gpt', 'gan', 'vae', 'autoencoder',
            'random forest', 'svm', 'regression', 'classification', 'clustering'
        ]
        
        self.concept_keywords = [
            'algorithm', 'model', 'optimization', 'training', 'inference', 'prediction',
            'accuracy', 'precision', 'recall', 'f1-score', 'loss function', 'gradient',
            'backpropagation', 'feature', 'embedding', 'representation'
        ]
    
    def extract_graph(self, papers: List[Dict]) -> Dict:
        """
        Extract knowledge graph from papers
        
        Args:
            papers: List of paper dictionaries
            
        Returns:
            Dict with nodes and edges
        """
        try:
            nodes = []
            edges = []
            node_ids = set()
            
            # Extract nodes and edges from each paper
            for paper in papers:
                paper_id = str(paper.get('_id', paper.get('id', '')))
                title = paper.get('title', '')
                authors = paper.get('authors', [])
                abstract = paper.get('abstract', '')
                categories = paper.get('categories', [])
                
                # Add paper node
                paper_node_id = f"paper_{paper_id}"
                if paper_node_id not in node_ids:
                    nodes.append({
                        'id': paper_node_id,
                        'label': title[:50] + "..." if len(title) > 50 else title,
                        'type': 'paper',
                        'data': {
                            'title': title,
                            'paperId': paper_id
                        }
                    })
                    node_ids.add(paper_node_id)
                
                # Add author nodes and edges
                for author in authors[:3]:  # Limit to top 3 authors
                    author_id = f"author_{author.replace(' ', '_')}"
                    if author_id not in node_ids:
                        nodes.append({
                            'id': author_id,
                            'label': author,
                            'type': 'author',
                            'data': {'name': author}
                        })
                        node_ids.add(author_id)
                    
                    edges.append({
                        'source': author_id,
                        'target': paper_node_id,
                        'type': 'authored_by',
                        'weight': 1
                    })
                
                # Extract methods and concepts
                text = f"{title} {abstract}".lower()
                
                # Extract methods
                found_methods = self._extract_keywords(text, self.method_keywords)
                for method in found_methods:
                    method_id = f"method_{method.replace(' ', '_')}"
                    if method_id not in node_ids:
                        nodes.append({
                            'id': method_id,
                            'label': method,
                            'type': 'method',
                            'data': {'name': method}
                        })
                        node_ids.add(method_id)
                    
                    edges.append({
                        'source': paper_node_id,
                        'target': method_id,
                        'type': 'uses_method',
                        'weight': 2
                    })
                
                # Extract concepts
                found_concepts = self._extract_keywords(text, self.concept_keywords)
                for concept in found_concepts[:5]:  # Limit concepts
                    concept_id = f"concept_{concept.replace(' ', '_')}"
                    if concept_id not in node_ids:
                        nodes.append({
                            'id': concept_id,
                            'label': concept,
                            'type': 'concept',
                            'data': {'name': concept}
                        })
                        node_ids.add(concept_id)
                    
                    edges.append({
                        'source': paper_node_id,
                        'target': concept_id,
                        'type': 'related_to',
                        'weight': 1
                    })
                
                # Add category nodes
                for category in categories[:2]:  # Limit categories
                    category_id = f"keyword_{category.replace(' ', '_').replace('.', '_')}"
                    if category_id not in node_ids:
                        nodes.append({
                            'id': category_id,
                            'label': category,
                            'type': 'keyword',
                            'data': {'name': category}
                        })
                        node_ids.add(category_id)
                    
                    edges.append({
                        'source': paper_node_id,
                        'target': category_id,
                        'type': 'has_keyword',
                        'weight': 1
                    })
            
            # Calculate metadata
            metadata = {
                'paperCount': sum(1 for n in nodes if n['type'] == 'paper'),
                'authorCount': sum(1 for n in nodes if n['type'] == 'author'),
                'conceptCount': sum(1 for n in nodes if n['type'] == 'concept')
            }
            
            logger.info(f"Extracted graph with {len(nodes)} nodes and {len(edges)} edges")
            
            return {
                'nodes': nodes,
                'edges': edges,
                'metadata': metadata
            }
        except Exception as e:
            logger.error(f"Error extracting graph: {e}")
            raise
    
    def _extract_keywords(self, text: str, keywords: List[str]) -> List[str]:
        """Extract keywords from text"""
        found = []
        for keyword in keywords:
            if keyword in text:
                found.append(keyword)
        return found

# Global instance
graph_extractor = GraphExtractor()