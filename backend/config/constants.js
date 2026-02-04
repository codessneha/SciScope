module.exports = {
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: 100
  },

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  PAPER_SOURCES: {
    ARXIV: 'arxiv',
    SEMANTIC_SCHOLAR: 'semantic_scholar'
  },
  CHAT: {
    MAX_HISTORY: 50,
    MAX_PAPERS_PER_QUERY: 10
  },
  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin'
  }
};