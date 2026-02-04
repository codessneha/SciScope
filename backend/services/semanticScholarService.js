const axios = require('axios');
const logger = require('../utils/logger');

const SEMANTIC_SCHOLAR_API_URL = 'https://api.semanticscholar.org/graph/v1';

// Format Semantic Scholar paper to our schema
const formatPaper = (paper) => {
  return {
    title: paper.title,
    authors: paper.authors ? paper.authors.map(a => a.name) : [],
    abstract: paper.abstract || '',
    semanticScholarId: paper.paperId,
    url: paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`,
    pdfUrl: paper.openAccessPdf?.url || null,
    publishedDate: paper.publicationDate ? new Date(paper.publicationDate) : null,
    citationCount: paper.citationCount || 0,
    categories: paper.fieldsOfStudy || [],
    source: 'semantic_scholar'
  };
};

// @desc    Search papers on Semantic Scholar
const searchPapers = async (query, limit = 10) => {
  try {
    const params = {
      query,
      limit,
      fields: 'paperId,title,abstract,authors,url,publicationDate,citationCount,fieldsOfStudy,openAccessPdf'
    };

    const response = await axios.get(`${SEMANTIC_SCHOLAR_API_URL}/paper/search`, {
      params,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const papers = response.data.data.map(formatPaper);

    logger.info(`Semantic Scholar search: ${query} - ${papers.length} results`);

    return papers;
  } catch (error) {
    logger.error('Semantic Scholar search error:', error.message);
    
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded for Semantic Scholar API');
    }
    
    throw new Error('Failed to search Semantic Scholar');
  }
};

// @desc    Get paper by Semantic Scholar ID
const getPaperById = async (paperId) => {
  try {
    const params = {
      fields: 'paperId,title,abstract,authors,url,publicationDate,citationCount,fieldsOfStudy,openAccessPdf,references,citations'
    };

    const response = await axios.get(
      `${SEMANTIC_SCHOLAR_API_URL}/paper/${paperId}`,
      {
        params,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const paper = formatPaper(response.data);

    logger.info(`Semantic Scholar fetch: ${paperId}`);

    return paper;
  } catch (error) {
    logger.error('Semantic Scholar fetch error:', error.message);
    
    if (error.response?.status === 404) {
      return null;
    }
    
    throw new Error('Failed to fetch paper from Semantic Scholar');
  }
};

// @desc    Get author's papers
const getAuthorPapers = async (authorId, limit = 10) => {
  try {
    const params = {
      fields: 'papers,papers.title,papers.abstract,papers.authors,papers.publicationDate,papers.citationCount',
      limit
    };

    const response = await axios.get(
      `${SEMANTIC_SCHOLAR_API_URL}/author/${authorId}`,
      {
        params,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const papers = response.data.papers.map(formatPaper);

    logger.info(`Semantic Scholar author papers: ${authorId} - ${papers.length} results`);

    return papers;
  } catch (error) {
    logger.error('Semantic Scholar author papers error:', error.message);
    throw new Error('Failed to fetch author papers from Semantic Scholar');
  }
};

// @desc    Get recommendations based on paper
const getRecommendations = async (paperId, limit = 10) => {
  try {
    const params = {
      fields: 'paperId,title,abstract,authors,publicationDate,citationCount',
      limit
    };

    const response = await axios.get(
      `${SEMANTIC_SCHOLAR_API_URL}/paper/${paperId}/recommendations`,
      {
        params,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const papers = response.data.recommendedPapers.map(formatPaper);

    logger.info(`Semantic Scholar recommendations: ${paperId} - ${papers.length} results`);

    return papers;
  } catch (error) {
    logger.error('Semantic Scholar recommendations error:', error.message);
    throw new Error('Failed to get recommendations from Semantic Scholar');
  }
};

module.exports = {
  searchPapers,
  getPaperById,
  getAuthorPapers,
  getRecommendations
};