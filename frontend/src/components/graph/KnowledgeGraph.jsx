import React, { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import LoadingSpinner from '../common/LoadingSpinner';

const KnowledgeGraph = ({ graphData, onNodeClick }) => {
  const graphRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      const container = graphRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.offsetWidth,
          height: container.offsetHeight || 600,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-600">No graph data available</p>
          <p className="text-sm text-gray-500 mt-1">
            Generate a knowledge graph from your papers
          </p>
        </div>
      </div>
    );
  }

  // Node color based on type
  const getNodeColor = (node) => {
    const colors = {
      paper: '#0ea5e9',
      author: '#8b5cf6',
      concept: '#10b981',
      method: '#f59e0b',
      keyword: '#ec4899',
    };
    return colors[node.type] || '#6b7280';
  };

  // Node size based on connections
  const getNodeSize = (node) => {
    const connections = graphData.edges.filter(
      (e) => e.source === node.id || e.target === node.id
    ).length;
    return 3 + connections * 0.5;
  };

  return (
    <div className="relative w-full h-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md border border-gray-200 z-10">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Node Types</h4>
        <div className="space-y-1">
          {['paper', 'author', 'concept', 'method', 'keyword'].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getNodeColor({ type }) }}
              ></div>
              <span className="text-xs text-gray-700 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Graph */}
      <ForceGraph2D
        ref={graphRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeLabel="label"
        nodeColor={getNodeColor}
        nodeVal={getNodeSize}
        linkColor={() => '#d1d5db'}
        linkWidth={(link) => link.weight || 1}
        onNodeClick={onNodeClick}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.label;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = getNodeColor(node);
          
          // Draw node circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, getNodeSize(node), 0, 2 * Math.PI);
          ctx.fill();
          
          // Draw label
          ctx.fillStyle = '#1f2937';
          ctx.fillText(label, node.x, node.y + getNodeSize(node) + fontSize);
        }}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
    </div>
  );
};

export default KnowledgeGraph;