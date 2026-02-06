import React from 'react';
import { 
  ArrowPathIcon, 
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon 
} from '@heroicons/react/24/outline';
import Button from '../common/Button';

const GraphControls = ({ onGenerate, onZoomIn, onZoomOut, onReset, loading }) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={onGenerate}
        loading={loading}
        size="sm"
      >
        <ArrowPathIcon className="h-4 w-4 mr-1" />
        Generate Graph
      </Button>
      
      <div className="flex items-center space-x-1 border border-gray-300 rounded-lg">
        <button
          onClick={onZoomOut}
          className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"
          title="Zoom Out"
        >
          <MagnifyingGlassMinusIcon className="h-4 w-4 text-gray-600" />
        </button>
        <div className="w-px h-6 bg-gray-300"></div>
        <button
          onClick={onZoomIn}
          className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
          title="Zoom In"
        >
          <MagnifyingGlassPlusIcon className="h-4 w-4 text-gray-600" />
        </button>
      </div>
      
      <Button
        onClick={onReset}
        variant="secondary"
        size="sm"
      >
        Reset View
      </Button>
    </div>
  );
};

export default GraphControls;