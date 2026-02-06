import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CircleStackIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Layout from '../components/layout/Layout';
import usePaperStore from '../store/paperStore';
import useChatStore from '../store/chatStore';
import useAuthStore from '../store/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { papers, getPapers, loading: papersLoading } = usePaperStore();
  const { sessions, getSessions, loading: sessionsLoading } = useChatStore();
  const [stats, setStats] = useState({
    totalPapers: 0,
    totalSessions: 0,
    recentActivity: 0,
  });

  useEffect(() => {
    getPapers(1, 5);
    getSessions();
  }, []);

  useEffect(() => {
    setStats({
      totalPapers: papers.length,
      totalSessions: sessions.length,
      recentActivity: sessions.filter(s => 
        new Date(s.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
    });
  }, [papers, sessions]);

  const quickActions = [
    {
      name: 'Search Papers',
      description: 'Find research papers from arXiv and Semantic Scholar',
      icon: MagnifyingGlassIcon,
      color: 'bg-blue-500',
      action: () => navigate('/papers/search'),
    },
    {
      name: 'New Chat Session',
      description: 'Start asking questions about your papers',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-green-500',
      action: () => navigate('/chat'),
    },
    {
      name: 'Knowledge Graph',
      description: 'Visualize connections between papers and concepts',
      icon: CircleStackIcon,
      color: 'bg-purple-500',
      action: () => navigate('/graph'),
    },
  ];

  const statCards = [
    {
      name: 'Total Papers',
      value: stats.totalPapers,
      icon: DocumentTextIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Chat Sessions',
      value: stats.totalSessions,
      icon: ChatBubbleLeftRightIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Recent Activity',
      value: stats.recentActivity,
      icon: CircleStackIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your research today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.name}
                  onClick={action.action}
                  className="card-hover cursor-pointer"
                >
                  <div className={`${action.color} p-3 rounded-lg w-fit mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.name}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Papers */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Papers</h2>
            <button
              onClick={() => navigate('/papers')}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all →
            </button>
          </div>

          {papersLoading ? (
            <LoadingSpinner />
          ) : papers.length === 0 ? (
            <div className="card text-center py-8">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No papers yet</p>
              <button
                onClick={() => navigate('/papers/search')}
                className="btn-primary mt-4"
              >
                Search for papers
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {papers.slice(0, 5).map((paper) => (
                <div
                  key={paper._id}
                  onClick={() => navigate(`/papers/${paper._id}`)}
                  className="card-hover cursor-pointer"
                >
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                    {paper.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {paper.authors?.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Chat Sessions</h2>
            <button
              onClick={() => navigate('/chat')}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all →
            </button>
          </div>

          {sessionsLoading ? (
            <LoadingSpinner />
          ) : sessions.length === 0 ? (
            <div className="card text-center py-8">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No chat sessions yet</p>
              <button
                onClick={() => navigate('/chat')}
                className="btn-primary mt-4"
              >
                Start chatting
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session) => (
                <div
                  key={session._id}
                  onClick={() => navigate('/chat', { state: { sessionId: session._id } })}
                  className="card-hover cursor-pointer"
                >
                  <h3 className="font-medium text-gray-900 mb-1">
                    {session.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {session.papers?.length || 0} papers
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;