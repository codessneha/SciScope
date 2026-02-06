import React from 'react';
import {
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

const PaperCard = ({ paper, selected, onSelect, onView }) => {
  return (
    <div
      className={`card-hover ${selected ? 'ring-2 ring-primary-500 bg-primary-50' : ''
        }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {paper.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <UserIcon className="h-4 w-4" />
              <span className="line-clamp-1">
                {paper.authors?.slice(0, 2).join(', ')}
                {paper.authors?.length > 2 && ` +${paper.authors.length - 2}`}
              </span>
            </div>
            {paper.publishedDate && (
              <div className="flex items-center space-x-1">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {formatDistanceToNow(new Date(paper.publishedDate), { addSuffix: true })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Checkbox */}
        {onSelect && (
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(paper)}
            className="h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
        )}
      </div>

      {/* Abstract */}
      <p className="text-sm text-gray-700 mb-4 line-clamp-3">
        {paper.abstract}
      </p>

      {/* Categories */}
      {paper.categories && paper.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {paper.categories.slice(0, 3).map((category, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <DocumentTextIcon className="h-4 w-4" />
          <span className="uppercase font-medium">{paper.source}</span>
          {paper.citationCount > 0 && (
            <span className="text-gray-400">• {paper.citationCount} citations</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
            >
              <span>PDF</span>
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </a>
          )}
          {onView && (
            <button
              onClick={() => onView(paper)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaperCard;