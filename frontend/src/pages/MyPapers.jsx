import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PaperList from '../components/papers/PaperList';
import PaperDetailsModal from '../components/papers/PaperDetailsModal';
import usePaperStore from '../store/paperStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const MyPapers = () => {
  const navigate = useNavigate();
  const {
    papers,
    selectedPapers,
    getPapers,
    togglePaperSelection,
    clearSelectedPapers,
    loading,
    pagination,
  } = usePaperStore();

  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    getPapers(1, 20);
  }, []);

  const handleViewDetails = (paper) => {
    setSelectedPaper(paper);
    setShowDetails(true);
  };

  const handleStartChat = () => {
    if (selectedPapers.length === 0) {
      toast.error('Please select at least one paper');
      return;
    }
    navigate('/chat');
  };

  const handleLoadMore = () => {
    if (pagination.page * pagination.limit < pagination.total) {
      getPapers(pagination.page + 1, pagination.limit);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Papers
            </h1>
            <p className="text-gray-600">
              {pagination.total} paper{pagination.total !== 1 ? 's' : ''} in your library
            </p>
          </div>
          <button
            onClick={() => navigate('/papers/search')}
            className="btn-primary"
          >
            + Add Papers
          </button>
        </div>

        {/* Selected Papers Banner */}
        {selectedPapers.length > 0 && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-900">
                {selectedPapers.length} paper{selectedPapers.length !== 1 ? 's' : ''} selected
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearSelectedPapers}
                className="btn-secondary text-sm"
              >
                Clear
              </button>
              <button
                onClick={handleStartChat}
                className="btn-primary text-sm"
              >
                Start Chat →
              </button>
            </div>
          </div>
        )}

        {/* Papers List */}
        <div>
          <PaperList
            papers={papers}
            loading={loading}
            selectedPapers={selectedPapers}
            onSelect={togglePaperSelection}
            onView={handleViewDetails}
          />
        </div>

        {/* Load More */}
        {pagination.page * pagination.limit < pagination.total && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              className="btn-secondary"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        {/* Paper Details Modal */}
        <PaperDetailsModal
          paper={selectedPaper}
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
        />
      </div>
    </Layout>
  );
};

export default MyPapers;