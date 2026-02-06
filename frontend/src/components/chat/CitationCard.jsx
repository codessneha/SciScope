import React from 'react';
import { DocumentTextIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const CitationCard = ({ citation }) => {
  const { paperId, text, relevance } = citation;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <DocumentTextIcon className="h-5 w-5 text-primary-600" />
          <h4 className="font-medium text-gray-900 line-clamp-1">
            {paperId?.title || 'Paper'}
          </h4>
        </div>

        {relevance && (
          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
            {Math.round(relevance * 100)}% relevant
          </span>
        )}
      </div>

      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
        {text}
      </p>

      {paperId?.authors && (
        <p className="text-xs text-gray-500 mb-2">
          {paperId.authors.slice(0, 2).join(', ')}
          {paperId.authors.length > 2 && ` +${paperId.authors.length - 2}`}
        </p>
      )}

      {paperId?.url && (
        <a
          href={paperId.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary-600 hover:text-primary-700 flex items-center space-x-1"
        >
          <span>View paper</span>
          <ArrowTopRightOnSquareIcon className="h-3 w-3" />
        </a>
      )}
    </div>
  );
};

export default CitationCard;
