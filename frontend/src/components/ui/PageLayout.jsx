import React from 'react';

const PageLayout = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
      <div className={`max-w-6xl mx-auto space-y-8 ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
