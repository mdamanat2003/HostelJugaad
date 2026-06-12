import React from 'react';

const PYQCard = ({ paper, onView, viewMode = 'grid', getExamTypeLabel }) => {
  const examLabel = getExamTypeLabel ? getExamTypeLabel(paper.examType) : paper.examType;

  if (viewMode === 'list') {
    return (
      <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-800 hover:border-slate-600 transition-all group">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-base font-bold text-white truncate">{paper.subject}</h3>
            {paper.isSolved && (
              <span className="text-xs font-bold bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Solved</span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>📋 {paper.code}</span>
            {paper.branch && <span>🏫 {paper.branch}</span>}
            {paper.semester && <span>📖 {paper.semester}</span>}
            <span>📅 {paper.year}</span>
            <span>📝 {examLabel}</span>
            <span>👁 {paper.views || 0}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onView(paper)}
            className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-cyan-700 transition-colors"
          >
            View PYQ
          </button>
          {paper.fileUrl ? (
            <a
              href={paper.fileUrl.replace('/upload/', '/upload/fl_attachment/')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-600 transition-colors"
            >
              📥 PDF
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/70 border border-slate-700 rounded-2xl overflow-hidden hover:border-slate-500 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 flex flex-col group">
      {/* Card Header */}
      <div className="px-5 py-4 border-b border-slate-700/50">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-base font-bold text-white leading-tight line-clamp-2 group-hover:text-cyan-400 transition-colors">
            {paper.subject}
          </h3>
          {paper.isSolved && (
            <span className="ml-2 flex-shrink-0 text-xs font-bold bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full">
              Solved
            </span>
          )}
        </div>
        {paper.branch && (
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <span>🏫</span> {paper.branch}
          </p>
        )}
      </div>

      {/* Card Body - Metadata */}
      <div className="px-5 py-3 flex-1">
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
          {paper.semester && (
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="text-xs">📖</span>
              <span>{paper.semester}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="text-xs">📅</span>
            <span>{paper.year}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="text-xs">📝</span>
            <span>{examLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="text-xs">👁</span>
            <span>{paper.views || 0}</span>
          </div>
        </div>
      </div>

      {/* Card Footer - Actions */}
      <div className="px-5 py-3 border-t border-slate-700/50 flex items-center gap-2">
        <button
          onClick={() => onView(paper)}
          className="flex-1 bg-cyan-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-cyan-700 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          👁 View PYQ
        </button>
        <button className="p-2.5 bg-slate-700/50 rounded-xl text-gray-400 hover:text-white hover:bg-slate-700 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PYQCard;
