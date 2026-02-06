import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import KnowledgeGraph from '../components/graph/KnowledgeGraph';
import GraphControls from '../components/graph/GraphControls';
import usePaperStore from '../store/paperStore';
import graphService from '../services/graphService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const KnowledgeGraphPage = () => {
  const { papers, selectedPapers, togglePaperSelection } = usePaperStore();
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateGraph = async () => {
    if (selectedPapers.length === 0) {
      toast.error('Please select papers to generate graph');
      return;
    }

    setLoading(true);
    try {
      const response = await graphService.generateGraph({
        paperIds: selectedPapers.map(p => p._id),
      });
      setGraphData(response.data);
      toast.success('Knowledge graph generated!');
    } catch (error) {
      toast.error('Failed to generate graph. Make sure ML service is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (node) => {
    console.log('Node clicked:', node);
    // You can add custom logic here, e.g., show node details
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-180px)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Knowledge Graph
            </h1>
            <p className="text-gray-600">
              Visualize connections between papers, authors, and concepts
            </p>
          </div>
          <GraphControls
            onGenerate={handleGenerateGraph}
            loading={loading}
          />
        </div>

        {/* Graph Display */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 h-[calc(100%-100px)]">
          {loading ? (
            <LoadingSpinner message="Generating knowledge graph..." />
          ) : graphData ? (
            <KnowledgeGraph
              graphData={graphData}
              onNodeClick={handleNodeClick}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-600 mb-4">No graph generated yet</p>
                <p className="text-sm text-gray-500 mb-6">
                  Select papers from your library and click "Generate Graph"
                </p>
                {selectedPapers.length > 0 ? (
                  <button
                    onClick={handleGenerateGraph}
                    className="btn-primary"
                  >
                    Generate Graph from {selectedPapers.length} Selected Papers
                  </button>
                ) : (
                  <button
                    onClick={() => window.location.href = '/papers'}
                    className="btn-primary"
                  >
                    Go to My Papers
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default KnowledgeGraphPage;