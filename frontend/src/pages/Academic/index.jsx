import React, { useState, useEffect, useRef } from 'react';
import { pyqAPI } from '../../services/api';
import PYQCard from '../../components/ui/PYQCard';
import Modal from '../../components/ui/Modal';

const EXAM_TYPES = [
  { value: 'midsem1', label: 'Mid Sem 1' },
  { value: 'midsem2', label: 'Mid Sem 2' },
  { value: 'endsem', label: 'End Sem' },
  { value: 'classtest', label: 'Class Test' },
  { value: 'other', label: 'Other' },
];

const SEMESTERS = ['1 Sem', '2 Sem', '3 Sem', '4 Sem', '5 Sem', '6 Sem', '7 Sem', '8 Sem'];

const COURSES = [
  'Department of Computer Science & Engineering (CSE)',
  'Department of Mechanical Engineering (ME)',
  'Department of Civil Engineering (CE)',
  'Department of Electrical Engineering (EE)',
  'Department of Electronics & Communication (ECE)',
  'Department of Information Technology (IT)',
];

const BRANCHES = [
  'BTech - Computer Science & Engineering',
  'BTech - Mechanical Engineering',
  'BTech - Civil Engineering',
  'BTech - Electrical Engineering',
  'BTech - Electronics & Communication',
  'BTech - Information Technology',
];

const YEARS = (() => {
  const current = new Date().getFullYear();
  const years = [];
  for (let y = current; y >= current - 10; y--) {
    years.push(`${y}-${String(y + 1).slice(2)}`);
  }
  return years;
})();

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'true', label: 'Solved' },
  { value: 'false', label: 'Unsolved' },
];

const SearchableDropdown = ({ label, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref} className="relative">
      {label && <label className="block text-cyan-400 text-sm font-bold mb-1.5">{label}</label>}
      <div
        className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-gray-200 cursor-pointer flex items-center justify-between hover:border-cyan-500/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-gray-200' : 'text-gray-400'}>{value || placeholder}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-48 overflow-auto">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 bg-slate-700 border-b border-slate-600 text-sm text-gray-200 outline-none placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          {filtered.map(option => (
            <div
              key={option}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-slate-700 ${option === value ? 'text-cyan-400 bg-slate-700/50' : 'text-gray-300'}`}
              onClick={() => { onChange(option); setIsOpen(false); setSearch(''); }}
            >
              {option}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">No results</div>
          )}
        </div>
      )}
    </div>
  );
};

const Academic = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewPaper, setViewPaper] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const [filters, setFilters] = useState({
    isSolved: '',
    course: '',
    branch: '',
    semester: '',
    year: '',
    examType: '',
  });

  const [pyqForm, setPyqForm] = useState({
    subject: '',
    code: '',
    course: '',
    branch: '',
    semester: '',
    examType: 'midsem1',
    year: '',
    isSolved: false,
  });

  useEffect(() => {
    fetchPYQs();
  }, []);

  const fetchPYQs = async (appliedFilters = {}) => {
    setLoading(true);
    try {
      const response = await pyqAPI.getPYQs({ ...appliedFilters, search: searchQuery });
      setPyqs(response.data);
      setError('');
    } catch (err) {
      setError('PYQs load nahi ho sake');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
  };

  const applyFilters = () => {
    const activeFilters = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v) activeFilters[k] = v;
    });
    if (searchQuery) activeFilters.search = searchQuery;
    fetchPYQs(activeFilters);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, filters]);

  const handlePyqFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPyqForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Pehle file select karo!");
      return;
    }

    setLoading(true);
    try {
      let user = {};
      try {
        user = JSON.parse(localStorage.getItem('user') || '{}');
      } catch {
        localStorage.removeItem('user');
      }

      const pyqPayload = {
        ...pyqForm,
        uploaderId: user.id,
      };

      await pyqAPI.uploadPYQ(pyqPayload, selectedFile);

      setPyqForm({
        subject: '',
        code: '',
        course: '',
        branch: '',
        semester: '',
        examType: 'midsem1',
        year: '',
        isSolved: false,
      });
      setSelectedFile(null);
      setIsUploadModalOpen(false);
      setError('');

      await fetchPYQs();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (paper) => {
    setViewPaper(paper);
    try {
      await pyqAPI.incrementViews(paper._id);
    } catch {
      // silently ignore view count errors
    }
  };

  const getExamTypeLabel = (val) => {
    const found = EXAM_TYPES.find(e => e.value === val);
    return found ? found.label : val;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            PYQs - Integral University
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Access past year question papers, understand trends, improve strategies, and ace exams
            confidently with a well-organized, easy-to-use database for students.
          </p>
        </div>

        {/* Search Bar + Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-bold transition-colors ${
              showFilters ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-slate-800 border-slate-600 text-gray-300 hover:border-slate-500'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>

          <div className="flex-1 min-w-[200px] relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search PYQs..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-gray-200 outline-none focus:border-cyan-500 transition-colors placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
          >
            <span>+</span> Add PYQ
          </button>

          {/* View Mode Toggle */}
          <div className="flex border border-slate-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 ${viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-gray-200'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 ${viewMode === 'list' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-gray-400 hover:text-gray-200'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        {showFilters && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-wrap gap-3 items-end animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="min-w-[140px]">
              <select
                value={filters.isSolved}
                onChange={(e) => handleFilterChange('isSolved', e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-cyan-500 appearance-none cursor-pointer"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="min-w-[160px]">
              <SearchableDropdown
                options={COURSES}
                value={filters.course}
                onChange={(v) => handleFilterChange('course', v)}
                placeholder="Select Course"
              />
            </div>

            <div className="min-w-[160px]">
              <SearchableDropdown
                options={BRANCHES}
                value={filters.branch}
                onChange={(v) => handleFilterChange('branch', v)}
                placeholder="Select Branch"
              />
            </div>

            <div className="min-w-[140px]">
              <select
                value={filters.semester}
                onChange={(e) => handleFilterChange('semester', e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-cyan-500 appearance-none cursor-pointer"
              >
                <option value="">All Semesters</option>
                {SEMESTERS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="min-w-[130px]">
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-cyan-500 appearance-none cursor-pointer"
              >
                <option value="">All Years</option>
                {YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="min-w-[140px]">
              <select
                value={filters.examType}
                onChange={(e) => handleFilterChange('examType', e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-cyan-500 appearance-none cursor-pointer"
              >
                <option value="">All Exam Types</option>
                {EXAM_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setFilters({ isSolved: '', course: '', branch: '', semester: '', year: '', examType: '' });
                setSearchQuery('');
              }}
              className="px-4 py-2.5 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* PYQs Grid / List */}
        {!loading && (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
              : 'space-y-3'
          }>
            {pyqs.length > 0 ? (
              pyqs.map(paper => (
                <PYQCard
                  key={paper._id}
                  paper={paper}
                  onView={handleView}
                  viewMode={viewMode}
                  getExamTypeLabel={getExamTypeLabel}
                />
              ))
            ) : (
              <div className="col-span-full bg-slate-800/50 border border-slate-700 rounded-2xl py-16 flex flex-col items-center justify-center text-center">
                <span className="text-6xl mb-4 opacity-40">📂</span>
                <h3 className="text-xl font-bold text-gray-300 mb-2">No papers found</h3>
                <p className="text-gray-500 max-w-sm">We couldn't find any question papers matching your filters.</p>
              </div>
            )}
          </div>
        )}

        {/* Upload Modal */}
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => { setIsUploadModalOpen(false); setSelectedFile(null); setError(''); }}
          title="Add New PYQ"
          dark
        >
          <form className="space-y-4" onSubmit={handleUploadSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <SearchableDropdown
              label="Course *"
              options={COURSES}
              value={pyqForm.course}
              onChange={(v) => setPyqForm(prev => ({ ...prev, course: v }))}
              placeholder="Select Course"
            />

            <SearchableDropdown
              label="Branch *"
              options={BRANCHES}
              value={pyqForm.branch}
              onChange={(v) => setPyqForm(prev => ({ ...prev, branch: v }))}
              placeholder="Select Branch"
            />

            <div>
              <label className="block text-cyan-400 text-sm font-bold mb-1.5">Subject *</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject Name"
                  value={pyqForm.subject}
                  onChange={handlePyqFormChange}
                  className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-cyan-500 placeholder-gray-400"
                  required
                />
                <input
                  type="text"
                  name="code"
                  placeholder="Subject Code"
                  value={pyqForm.code}
                  onChange={handlePyqFormChange}
                  className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-cyan-500 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-cyan-400 text-sm font-bold mb-1.5">Semester</label>
              <select
                name="semester"
                value={pyqForm.semester}
                onChange={handlePyqFormChange}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-cyan-500 appearance-none cursor-pointer"
              >
                <option value="">Select Semester</option>
                {SEMESTERS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-cyan-400 text-sm font-bold mb-1.5">Year *</label>
                <select
                  name="year"
                  value={pyqForm.year}
                  onChange={handlePyqFormChange}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-cyan-500 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select Year</option>
                  {YEARS.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-cyan-400 text-sm font-bold mb-1.5">Exam Type *</label>
                <select
                  name="examType"
                  value={pyqForm.examType}
                  onChange={handlePyqFormChange}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-cyan-500 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select Exam Type</option>
                  {EXAM_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-cyan-400 text-sm font-bold mb-1.5">Upload PDF (Max 10MB) *</label>
              <div className="flex items-center gap-4">
                <label className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-cyan-700 transition-colors">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                </label>
                <span className="text-sm text-gray-400">
                  {selectedFile ? selectedFile.name : 'No file chosen'}
                </span>
                <div className="ml-auto flex flex-col items-center text-gray-500 cursor-pointer hover:text-cyan-400 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-xs mt-1">Click to upload file</span>
                </div>
              </div>
            </div>

            {/* Solved Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-300">Solved Paper</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isSolved"
                  checked={pyqForm.isSolved}
                  onChange={handlePyqFormChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>

            <div className="pt-2 flex justify-end gap-3 border-t border-slate-700">
              <button
                type="button"
                onClick={() => { setIsUploadModalOpen(false); setSelectedFile(null); setError(''); }}
                className="px-5 py-2.5 rounded-lg font-bold text-gray-400 hover:bg-slate-700 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? 'Uploading...' : 'Add PYQ'}
              </button>
            </div>
          </form>
        </Modal>

        {/* View Modal */}
        <Modal
          isOpen={!!viewPaper}
          onClose={() => setViewPaper(null)}
          title={viewPaper ? `${viewPaper.subject} (${viewPaper.year})` : ''}
          dark
        >
          {viewPaper && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center h-[60vh] md:h-[500px]">
                {viewPaper.fileUrl && viewPaper.fileUrl.toLowerCase().includes('.pdf') ? (
                  <iframe
                    src={viewPaper.fileUrl}
                    className="w-full h-full"
                    title="PDF Viewer"
                  />
                ) : viewPaper.fileUrl ? (
                  <img
                    src={viewPaper.fileUrl}
                    alt="Question Paper Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <p className="text-red-400 font-medium">File not available</p>
                )}
              </div>
              <div className="w-full flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
                <span className="text-sm font-semibold text-gray-300">Need this for later?</span>
                {viewPaper.fileUrl ? (
                  <a
                    href={viewPaper.fileUrl.replace('/upload/', '/upload/fl_attachment/')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-cyan-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-cyan-700 transition-colors"
                  >
                    Download
                  </a>
                ) : (
                  <span className="text-sm text-gray-500 font-medium">No file to download</span>
                )}
              </div>
            </div>
          )}
        </Modal>

      </div>
    </div>
  );
};

export default Academic;
