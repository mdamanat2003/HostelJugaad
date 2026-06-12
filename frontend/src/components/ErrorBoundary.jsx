import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8 font-sans">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-6">An unexpected error occurred. Please try again.</p>
            <button
              onClick={this.handleReset}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
