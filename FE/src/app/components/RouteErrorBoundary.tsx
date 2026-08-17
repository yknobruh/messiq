import React from "react";
import { useRouteError, Link } from "react-router";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

export function RouteErrorBoundary() {
  const error: any = useRouteError();
  console.error("Route Error:", error);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Unexpected Error</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          {error?.message || "Something went wrong while loading this page. Please try again or return home."}
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 w-full h-11 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
          
          <Link 
            to="/dashboard"
            className="flex items-center justify-center gap-2 w-full h-11 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {(import.meta as any).env?.DEV && error?.stack && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            <details className="text-left">
              <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
                View stack trace
              </summary>
              <pre className="mt-4 p-4 bg-gray-900 text-gray-300 text-[10px] rounded-lg overflow-auto max-h-48 leading-relaxed">
                {error.stack}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
