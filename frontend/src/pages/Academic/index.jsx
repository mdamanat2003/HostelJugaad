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
  'B.Tech',
];

const BRANCHES = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical Engineering (EE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
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
      {label && <label className="block text-sm font-bold text-gray-700 mb-1.5">{label}</label>}
      <div
        className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm cursor-pointer flex items-center justify-between hover:border-blue-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>{value || placeholder}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-100 rounded-lg shadow-xl max-h-48 overflow-auto">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 bg-gray-50 border-b border-gray-100 text-sm text-gray-800 outline-none placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          {filtered.map(option => (
            <div
              key={option}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${option === value ? 'text-blue-600 font-medium bg-blue-50/50' : 'text-gray-700'}`}
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

  const isFirstRender = useRef(true);

  const fetchPYQs = async (appliedFilters = {}) => {
    setLoading(true);
    try {
      const response = await pyqAPI.getPYQs(appliedFilters);
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

  const buildActiveFilters = () => {
    const activeFilters = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v) activeFilters[k] = v;
    });
    if (searchQuery) activeFilters.search = searchQuery;
    return activeFilters;
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchPYQs(buildActiveFilters());
      return;
    }
    const timer = setTimeout(() => {
      fetchPYQs(buildActiveFilters());
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

      await fetchPYQs(buildActiveFilters());
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
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Academic Hub 📚
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Access past year question papers, understand trends, improve strategies, and ace exams
            confidently with a well-organized, easy-to-use database for students.
          </p>
        </div>

        {/* Search Bar + Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-bold transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 shadow-sm'
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
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-colors placeholder-gray-400 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 active:scale-95"
          >
            <span>↑</span> Upload PYQ
          </button>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        {showFilters && (
          <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-wrap gap-3 items-end shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="min-w-[140px]">
              <select
                value={filters.isSolved}
                onChange={(e) => handleFilterChange('isSolved', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 appearance-none cursor-pointer"
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
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 appearance-none cursor-pointer"
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
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 appearance-none cursor-pointer"
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
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 appearance-none cursor-pointer"
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
              className="px-4 py-2.5 text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
              <div className="col-span-full bg-white border border-gray-100 shadow-sm rounded-2xl py-16 flex flex-col items-center justify-center text-center">
                <span className="text-6xl mb-4 opacity-50">📂</span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No papers found</h3>
                <p className="text-gray-500 max-w-sm">We couldn't find any question papers matching your filters.</p>
              </div>
            )}
          </div>
        )}

        {/* Upload Modal */}
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => { setIsUploadModalOpen(false); setSelectedFile(null); setError(''); }}
          title="Upload PYQ / Notes 📄"
        >
          <form className="space-y-4" onSubmit={handleUploadSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
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
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Subject *</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject Name"
                  value={pyqForm.subject}
                  onChange={handlePyqFormChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none bg-white text-sm"
                  required
                />
                <input
                  type="text"
                  name="code"
                  placeholder="Subject Code"
                  value={pyqForm.code}
                  onChange={handlePyqFormChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none bg-white text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Semester</label>
              <select
                name="semester"
                value={pyqForm.semester}
                onChange={handlePyqFormChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none bg-white text-sm appearance-none cursor-pointer"
              >
                <option value="">Select Semester</option>
                {SEMESTERS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Year *</label>
                <select
                  name="year"
                  value={pyqForm.year}
                  onChange={handlePyqFormChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none bg-white text-sm appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select Year</option>
                  {YEARS.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Exam Type *</label>
                <select
                  name="examType"
                  value={pyqForm.examType}
                  onChange={handlePyqFormChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none bg-white text-sm appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select Exam Type</option>
                  {EXAM_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Upload PDF (Max 10MB) *</label>
              <div className="flex items-center gap-4">
                <label className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700 transition-colors shadow-sm">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                </label>
                <span className="text-sm text-gray-500 font-medium">
                  {selectedFile ? selectedFile.name : 'No file chosen'}
                </span>
              </div>
            </div>

            {/* Solved Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-bold text-gray-700">Solved Paper</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isSolved"
                  checked={pyqForm.isSolved}
                  onChange={handlePyqFormChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => { setIsUploadModalOpen(false); setSelectedFile(null); setError(''); }}
                className="px-5 py-2.5 rounded-lg font-bold text-gray-500 hover:bg-gray-100 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-md"
              >
                {loading ? 'Uploading...' : 'Upload File'}
              </button>
            </div>
          </form>
        </Modal>

        {/* View Modal */}
        <Modal
          isOpen={!!viewPaper}
          onClose={() => setViewPaper(null)}
          title={viewPaper ? `${viewPaper.subject} (${viewPaper.year})` : ''}
        >
          {viewPaper && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center h-[60vh] md:h-[500px]">
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
                  <p className="text-red-500 font-medium">File not available</p>
                )}
              </div>
              <div className="w-full flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                <span className="text-sm font-semibold text-blue-800">Need this for later?</span>
                {viewPaper.fileUrl ? (
                  <a
                    href={viewPaper.fileUrl.replace('/upload/', '/upload/fl_attachment/')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors"
                  >
                    Download PDF
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