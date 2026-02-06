import React from 'react';
import PaperCard from './PaperCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

const PaperList = ({
  papers,
  loading,
  selectedPapers = [],
  onSelect,
  onView
}) => {
  if (loading) {
    return <LoadingSpinner message="Loading papers..." />;
  }

  if (!papers || papers.length === 0) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No papers found</h3>
        <p className="text-gray-600">Try searching for papers or adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {papers.map((paper) => (
        <PaperCard
          key={paper._id || paper.arxivId || paper.semanticScholarId}
          paper={paper}
          selected={selectedPapers.some(p =>
            (p._id && p._id === paper._id) ||
            (p.arxivId && p.arxivId === paper.arxivId) ||
            (p.url && p.url === paper.url)
          )}
          onSelect={onSelect}
          onView={onView}
        />
      ))}
    </div>
  );
};

export default PaperList;