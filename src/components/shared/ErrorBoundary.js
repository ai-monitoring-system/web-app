import React, { Component } from "react";
import { Navigate } from "react-router-dom";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null, redirect: false };

  // Update state when an error is caught
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Log the error and error info
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });

    // Redirect to the Internal Error page after catching an error
    setTimeout(() => {
      this.setState({ redirect: true });
    }, 3000); // Delay to show the error UI briefly before redirecting
  }

  // Reset the error state to allow retrying
  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, redirect: false });
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to="/500" replace />;
    }

    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
          <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
            We're sorry, but an unexpected error has occurred. Redirecting to the error page...
          </p>
          {this.state.error && (
            <details className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-md max-w-2xl text-sm mb-8">
              <summary className="font-semibold cursor-pointer">Error Details</summary>
              <pre className="mt-2 text-gray-700 dark:text-gray-300">
                {this.state.error.toString()}
              </pre>
              <pre className="mt-2 text-gray-500 dark:text-gray-400">{this.state.errorInfo?.componentStack}</pre>
            </details>
          )}
          <button
            onClick={this.handleRetry}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-150"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;