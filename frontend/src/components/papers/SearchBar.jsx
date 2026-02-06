import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('arxiv');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, source);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for research papers..."
            className="input-field pl-10"
          />
        </div>

        {/* Source Select */}
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="input-field md:w-48"
        >
          <option value="arxiv">arXiv</option>
          <option value="semantic_scholar">Semantic Scholar</option>
        </select>

        {/* Search Button */}
        <Button
          type="submit"
          loading={loading}
          className="md:w-32"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
