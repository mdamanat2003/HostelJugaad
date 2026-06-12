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
  <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col group">

    {/* Header */}
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-blue-100">
      <div className="flex items-start justify-between">
        <div>
          {paper.code && (
            <p className="text-base font-bold text-blue-600 mb-1">
              {paper.code}
            </p>
          )}

          {paper.branch && (
            <p className="text-xs text-slate-500 line-clamp-1">
              🏫 {paper.branch}
            </p>
          )}
        </div>

        <span className="bg-white border border-blue-200 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
          {paper.year}
        </span>
      </div>
    </div>

    {/* Body */}
    <div className="p-4 flex-1">
      <div className="mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          {examLabel}
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-800 leading-snug mb-3 line-clamp-2">
        {paper.subject}
      </h3>

      {paper.isSolved && (
        <div className="mb-2">
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[11px] font-semibold">
            Solved
          </span>
        </div>
      )}

      <div className="space-y-1 text-sm text-slate-600">
        {paper.semester && (
          <div className="flex items-center gap-2">
            <span>📖</span>
            <span>{paper.semester}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span>👁</span>
          <span>{paper.views || 0} Views</span>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="p-4 border-t border-slate-100 flex gap-2">
      <button
        onClick={() => onView(paper)}
        className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
      >
        👁 View
      </button>

      {paper.fileUrl ? (
        <a
          href={paper.fileUrl.replace('/upload/', '/upload/fl_attachment/')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
        >
          📥 PDF
        </a>
      ) : (
        <button
          disabled
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold opacity-50 cursor-not-allowed"
        >
          PDF
        </button>
      )}
    </div>
  </div>
)};

export default PYQCard;
