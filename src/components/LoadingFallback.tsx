import React from 'react';

export const LoadingFallback: React.FC = () => (
  <div
    className="flex justify-center items-center h-screen"
    role="status"
    aria-live="polite"
    aria-label="Loading content"
  >
    <div className="w-8 h-8 rounded-full border-t-2 border-b-2 animate-spin border-primary"></div>
    <span className="sr-only">Loading...</span>
  </div>
);
