import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SearchBar from '../components/papers/SearchBar';
import PaperList from '../components/papers/PaperList';
import PaperDetailsModal from '../components/papers/PaperDetailsModal';
import usePaperStore from '../store/paperStore';
import toast from 'react-hot-toast';

const PaperSearch = () => {
  const navigate = useNavigate();
  const {
    searchResults,
    selectedPapers,
    searchPapers,
    addPaper,
    togglePaperSelection,
    clearSelectedPapers,
    loading,
  } = usePaperStore();

  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleSearch = async (query, source) => {
    try {
      await searchPapers(query, source, 20);
    } catch (error) {
      toast.error('Failed to search papers');
    }
  };

  const handleAddPaper = async (paper) => {
    try {
      await addPaper(paper);
      toast.success('Paper added to your library!');
    } catch (error) {
      toast.error('Failed to add paper');
    }
  };

  const handleViewDetails = (paper) => {
    setSelectedPaper(paper);
    setShowDetails(true);
  };

  const handleAddToChat = async (paper) => {
    await handleAddPaper(paper);
    togglePaperSelection(paper);
    toast.success('Paper added! You can now use it in chat.');
  };

  const handleStartChat = () => {
    if (selectedPapers.length === 0) {
      toast.error('Please select at least one paper');
      return;
    }
    navigate('/chat');
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Research Papers
          </h1>
          <p className="text-gray-600">
            Find papers from arXiv and Semantic Scholar
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* Selected Papers Banner */}
        {selectedPapers.length > 0 && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-900">
                {selectedPapers.length} paper{selectedPapers.length !== 1 ? 's' : ''} selected
              </p>
              <p className="text-xs text-primary-700 mt-1">
                Ready to start chatting with these papers
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

        {/* Results */}
        <div>
          <PaperList
            papers={searchResults}
            loading={loading}
            selectedPapers={selectedPapers}
            onSelect={togglePaperSelection}
            onView={handleViewDetails}
          />
        </div>

        {/* Paper Details Modal */}
        <PaperDetailsModal
          paper={selectedPaper}
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          onAddToChat={handleAddToChat}
        />
      </div>
    </Layout>
  );
};

export default PaperSearch;