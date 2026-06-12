import React from 'react';

const EmptyState = ({ icon = '\uD83D\uDCED', title = 'Nothing found', message, onReset, resetLabel = 'Clear all filters' }) => {
  return (
    <div className="col-span-full bg-white rounded-3xl border border-gray-100 py-16 flex flex-col items-center justify-center text-center shadow-sm">
      <span className="text-6xl mb-4 opacity-50">{icon}</span>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      {message && <p className="text-gray-500 max-w-sm">{message}</p>}
      {onReset && (
        <button
          onClick={onReset}
          className="mt-6 text-blue-600 font-bold hover:underline"
        >
          {resetLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
