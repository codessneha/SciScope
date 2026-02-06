import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import useAuthStore from '../store/authStore';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary-600 p-3 rounded-xl">
              <DocumentTextIcon className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Paper<span className="text-primary-600">Nova</span>
          </h1>
          <p className="text-gray-600 mt-2">AI Research Copilot</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome Back</h2>

          {error && (
            <div className="mb-4">
              <ErrorMessage message={error} onClose={clearError} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary-600">1000+</div>
            <div className="text-xs text-gray-600">Papers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-600">AI-Powered</div>
            <div className="text-xs text-gray-600">Q&A</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary-600">Free</div>
            <div className="text-xs text-gray-600">Forever</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;