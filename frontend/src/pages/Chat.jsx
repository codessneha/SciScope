import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ChatBox from '../components/chat/ChatBox';
import SessionList from '../components/chat/SessionList';
import PaperList from '../components/papers/PaperList';
import useChatStore from '../store/chatStore';
import usePaperStore from '../store/paperStore';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const Chat = () => {
  const location = useLocation();
  const {
    sessions,
    currentSession,
    messages,
    getSessions,
    setCurrentSession,
    createSession,
    deleteSession,
    askQuestion,
    loading,
  } = useChatStore();

  const { selectedPapers, clearSelectedPapers } = usePaperStore();

  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');

  useEffect(() => {
    getSessions();

    // If coming from paper selection, auto-create session
    if (location.state?.sessionId) {
      setCurrentSession(location.state.sessionId);
    } else if (selectedPapers.length > 0 && !currentSession) {
      setShowNewSessionModal(true);
    }
  }, []);

  const handleCreateSession = async () => {
    if (!newSessionTitle.trim()) {
      toast.error('Please enter a session title');
      return;
    }

    try {
      await createSession({
        title: newSessionTitle,
        papers: selectedPapers.map(p => p._id),
      });
      setShowNewSessionModal(false);
      setNewSessionTitle('');
      clearSelectedPapers();
      toast.success('Session created!');
    } catch (error) {
      toast.error('Failed to create session');
    }
  };

  const handleSelectSession = async (sessionId) => {
    try {
      await setCurrentSession(sessionId);
    } catch (error) {
      toast.error('Failed to load session');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await deleteSession(sessionId);
        toast.success('Session deleted');
      } catch (error) {
        toast.error('Failed to delete session');
      }
    }
  };

  const handleSendMessage = async (question) => {
    if (!currentSession) {
      toast.error('Please select a session first');
      return;
    }

    const paperIds = currentSession.papers.map(p => p._id || p);

    try {
      await askQuestion(question, paperIds);
    } catch (error) {
      toast.error('Failed to get answer. Make sure ML service is running.');
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-180px)]">
        <div className="grid grid-cols-12 gap-6 h-full">
          {/* Sessions Sidebar */}
          <div className="col-span-3">
            <SessionList
              sessions={sessions}
              currentSession={currentSession}
              onSelectSession={handleSelectSession}
              onCreateSession={() => setShowNewSessionModal(true)}
              onDeleteSession={handleDeleteSession}
            />
          </div>

          {/* Chat Area */}
          <div className="col-span-9 bg-white rounded-lg shadow-md border border-gray-200">
            {currentSession ? (
              <>
                {/* Session Header */}
                <div className="border-b border-gray-200 p-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentSession.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentSession.papers?.length || 0} papers in this session
                  </p>
                </div>

                {/* Chat */}
                <div className="h-[calc(100%-80px)]">
                  <ChatBox
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    loading={loading}
                    selectedPapers={currentSession.papers || []}
                  />
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">No session selected</p>
                  <button
                    onClick={() => setShowNewSessionModal(true)}
                    className="btn-primary"
                  >
                    Create New Session
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* New Session Modal */}
        <Modal
          isOpen={showNewSessionModal}
          onClose={() => setShowNewSessionModal(false)}
          title="Create New Session"
          size="md"
        >
          <div className="space-y-4">
            <Input
              label="Session Title"
              value={newSessionTitle}
              onChange={(e) => setNewSessionTitle(e.target.value)}
              placeholder="e.g., Machine Learning Research"
            />

            {selectedPapers.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Selected Papers ({selectedPapers.length})
                </p>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {selectedPapers.map(paper => (
                    <div key={paper._id} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                      {paper.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowNewSessionModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateSession}>
                Create Session
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Chat;