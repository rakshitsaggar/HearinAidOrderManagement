import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import NewOrder from './pages/NewOrder';
import Orders from './pages/Orders';
import Appointments from './pages/Appointments';

// Simple Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We encountered an unexpected error. Please refresh the page to try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <main className="pb-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/new-order" element={<NewOrder />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="*" element={
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Page Not Found
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    The page you're looking for doesn't exist.
                  </p>
                  <a
                    href="/dashboard"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Go back to Dashboard
                  </a>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}