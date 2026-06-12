import React from 'react';

const PYQCard = ({ paper, onView }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
      
      {/* Top Banner - Subject Code */}
      <div className="bg-blue-50 px-5 py-3 border-b border-blue-100 flex justify-between items-center">
        <span className="font-bold text-blue-700 tracking-wider">{paper.code}</span>
        <span className="text-xs font-semibold bg-white px-2 py-1 rounded-md text-blue-600 shadow-sm">
          {paper.year}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{paper.examType}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {paper.subject}
        </h3>
        
        <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <span>👤</span> Uploaded by: {paper.uploader}
        </p>
        
        {/* Action Buttons */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3">
          {/* View Image Button */}
          <button 
            onClick={() => onView(paper)}
            className="flex-1 bg-gray-50 text-gray-700 py-2 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            👁️ View
          </button>
          
          {/* Download PDF Button */}
          {paper.fileUrl ? (
            <a 
              href={paper.fileUrl.replace('/upload/', '/upload/fl_attachment/')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              📥 PDF
            </a>
          ) : (
            <span className="flex-1 bg-gray-300 text-gray-500 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed">
              📥 PDF
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PYQCard;