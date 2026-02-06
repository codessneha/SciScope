import React from 'react';
import Modal from '../common/Modal';
import {
    UserIcon,
    CalendarIcon,
    ArrowTopRightOnSquareIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const PaperDetailsModal = ({ paper, isOpen, onClose, onAddToChat }) => {
    if (!paper) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Paper Details" size="lg">
            <div className="space-y-6">
                {/* Title */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {paper.title}
                    </h2>
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                        <UserIcon className="h-4 w-4" />
                        <span>{paper.authors?.join(', ')}</span>
                    </div>
                    {paper.publishedDate && (
                        <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{format(new Date(paper.publishedDate), 'MMMM dd, yyyy')}</span>
                        </div>
                    )}
                    <div className="flex items-center space-x-2">
                        <DocumentTextIcon className="h-4 w-4" />
                        <span className="uppercase font-medium">{paper.source}</span>
                    </div>
                </div>

                {/* Categories */}
                {paper.categories && paper.categories.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Categories</h3>
                        <div className="flex flex-wrap gap-2">
                            {paper.categories.map((category, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Abstract */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Abstract</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {paper.abstract}
                    </p>
                </div>

                {/* Citations */}
                {paper.citationCount > 0 && (
                    <div>
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">{paper.citationCount}</span> citations
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                        {paper.url && (
                            <a
                                href={paper.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                            >
                                <span>View on {paper.source}</span>
                                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                            </a>
                        )}
                        {paper.pdfUrl && (
                            <a
                                href={paper.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                            >
                                <span>Download PDF</span>
                                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                            </a>
                        )}
                    </div>
                    {onAddToChat && (
                        <button
                            onClick={() => {
                                onAddToChat(paper);
                                onClose();
                            }}
                            className="btn-primary"
                        >
                            Add to Chat
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default PaperDetailsModal;