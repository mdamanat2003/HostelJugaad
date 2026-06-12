import React from 'react';

const Modal = ({ isOpen, onClose, title, children, dark = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Dark Blur Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content Box */}
      <div className={`relative rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 ${
        dark ? 'bg-slate-800 border border-slate-700' : 'bg-white'
      }`}>
        
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex justify-between items-center ${
          dark ? 'border-slate-700 bg-slate-800' : 'border-gray-100 bg-gray-50/50'
        }`}>
          <h3 className={`text-xl font-extrabold ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              dark ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto hide-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
