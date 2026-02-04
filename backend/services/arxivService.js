const axios = require('axios');
const xml2js = require('xml2js');
const logger = require('../utils/logger');

const ARXIV_API_URL = 'http://export.arxiv.org/api/query';

// Parse XML to JSON
const parseXML = (xml) => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Format arXiv entry to our paper schema
const formatPaper = (entry) => {
  // Handle authors - can be array or single object
  let authors = [];
  if (entry.author) {
    if (Array.isArray(entry.author)) {
      authors = entry.author.map(a => a.name);
    } else {
      authors = [entry.author.name];
    }
  }

  // Extract arXiv ID from the id URL
  const arxivId = entry.id.split('/abs/')[1];

  // Handle categories
  let categories = [];
  if (entry.category) {
    if (Array.isArray(entry.category)) {
      categories = entry.category.map(c => c.$.term);
    } else {
      categories = [entry.category.$.term];
    }
  }

  return {
    title: entry.title.replace(/\n/g, ' ').trim(),
    authors,
    abstract: entry.summary.replace(/\n/g, ' ').trim(),
    arxivId,
    url: entry.id,
    pdfUrl: entry.id.replace('/abs/', '/pdf/') + '.pdf',
    publishedDate: new Date(entry.published),
    categories,
    source: 'arxiv'
  };
};

// @desc    Search papers on arXiv
const searchPapers = async (query, maxResults = 10) => {
  try {
    const params = {
      search_query: `all:${query}`,
      max_results: maxResults,
      sortBy: 'relevance',
      sortOrder: 'descending'
    };

    const response = await axios.get(ARXIV_API_URL, { params });

    const result = await parseXML(response.data);

    // Handle no results
    if (!result.feed.entry) {
      return [];
    }

    // Handle single result (not array)
    const entries = Array.isArray(result.feed.entry) 
      ? result.feed.entry 
      : [result.feed.entry];

    const papers = entries.map(formatPaper);

    logger.info(`arXiv search: ${query} - ${papers.length} results`);

    return papers;
  } catch (error) {
    logger.error('arXiv search error:', error.message);
    throw new Error('Failed to search arXiv');
  }
};

// @desc    Get paper by arXiv ID
const getPaperById = async (arxivId) => {
  try {
    const params = {
      id_list: arxivId
    };

    const response = await axios.get(ARXIV_API_URL, { params });
    const result = await parseXML(response.data);

    if (!result.feed.entry) {
      return null;
    }

    const paper = formatPaper(result.feed.entry);

    logger.info(`arXiv fetch: ${arxivId}`);

    return paper;
  } catch (error) {
    logger.error('arXiv fetch error:', error.message);
    throw new Error('Failed to fetch paper from arXiv');
  }
};

// @desc    Get papers by category
const getPapersByCategory = async (category, maxResults = 10) => {
  try {
    const params = {
      search_query: `cat:${category}`,
      max_results: maxResults,
      sortBy: 'submittedDate',
      sortOrder: 'descending'
    };

    const response = await axios.get(ARXIV_API_URL, { params });
    const result = await parseXML(response.data);

    if (!result.feed.entry) {
      return [];
    }

    const entries = Array.isArray(result.feed.entry) 
      ? result.feed.entry 
      : [result.feed.entry];

    const papers = entries.map(formatPaper);

    logger.info(`arXiv category search: ${category} - ${papers.length} results`);

    return papers;
  } catch (error) {
    logger.error('arXiv category search error:', error.message);
    throw new Error('Failed to search arXiv by category');
  }
};

module.exports = {
  searchPapers,
  getPaperById,
  getPapersByCategory
};