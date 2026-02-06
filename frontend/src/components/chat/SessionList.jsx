import React from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  TrashIcon,
  PlusIcon 
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import Button from '../common/Button';

const SessionList = ({ 
  sessions, 
  currentSession, 
  onSelectSession, 
  onCreateSession, 
  onDeleteSession 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Chat Sessions</h2>
          <Button onClick={onCreateSession} size="sm">
            <PlusIcon className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No sessions yet</p>
            <p className="text-sm text-gray-500 mt-1">Create one to get started</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session._id}
              onClick={() => onSelectSession(session._id)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                currentSession?._id === session._id
                  ? 'bg-primary-50 border-primary-500'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {session.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {session.papers?.length || 0} papers • {' '}
                    {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session._id);
                  }}
                  className="text-gray-400 hover:text-red-600 transition-colors ml-2"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionList;