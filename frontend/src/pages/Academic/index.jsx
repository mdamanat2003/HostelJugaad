import React, { useState, useEffect } from 'react';
import { pyqAPI } from '../../services/api';
import PYQCard from '../../components/ui/PYQCard';
import Modal from '../../components/ui/Modal';
import PageLayout from '../../components/ui/PageLayout';
import SearchBar from '../../components/ui/SearchBar';
import EmptyState from '../../components/ui/EmptyState';
import ErrorAlert from '../../components/ui/ErrorAlert';
import FormActions from '../../components/ui/FormActions';
import useFormHandler from '../../hooks/useFormHandler';
import useAsyncData from '../../hooks/useAsyncData';
import { getCurrentUser } from '../../utils/helpers';

const INITIAL_PYQ_FORM = {
  subject: '',
  code: '',
  examType: 'Mid Semester',
  year: new Date().getFullYear(),
};

const Academic = () => {
  // --- LOGIC PART ---
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewPaper, setViewPaper] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const { formData: pyqForm, handleChange: handlePyqFormChange, resetForm: resetPyqForm } = useFormHandler(INITIAL_PYQ_FORM);
  const { data: pyqs, loading, setLoading, error, setError, execute } = useAsyncData([]);

  // Fetch PYQs on component mount
  useEffect(() => {
    fetchPYQs();
  }, []);

  const fetchPYQs = () => {
    execute(() => pyqAPI.getPYQs()).catch(() => {});
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError("Pehle file select karo!");
      return;
    }

    setLoading(true);
    try {
      const user = getCurrentUser();
      
      const pyqPayload = {
        ...pyqForm,
        uploaderId: user.id,
      };

      await pyqAPI.uploadPYQ(pyqPayload, selectedFile);
      
      resetPyqForm();
      setSelectedFile(null);
      setIsUploadModalOpen(false);
      setError('');
      
      // Refresh PYQs
      await execute(() => pyqAPI.getPYQs());
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredPYQs = pyqs.filter(paper => 
    paper.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    paper.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- DESIGN (UI) PART ---
  return (
    <PageLayout>
      {/* Header Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Academic Hub &#x1F4DA;</h1>
          <p className="text-gray-500 mt-2 text-lg max-w-xl">
            Access previous year question papers (PYQs) and notes. View them instantly or download as PDFs.
          </p>
        </div>
        <div className="relative z-10 w-full md:w-auto">
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full md:w-auto bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>&#x2191;</span> Upload PYQ / Notes
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by subject name or code (e.g. CS301)..."
        className="max-w-xl"
      />

      {/* PYQs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPYQs.length > 0 ? (
          filteredPYQs.map(paper => (
            <PYQCard 
              key={paper._id} 
              paper={paper} 
              onView={(selectedPaper) => setViewPaper(selectedPaper)} 
            />
          ))
        ) : (
          <EmptyState
            icon="&#x1F4C2;"
            title="No papers found"
            message="We couldn't find any question papers matching your search."
          />
        )}
      </div>

      {/* 1. UPLOAD MODAL */}
      <Modal 
        isOpen={isUploadModalOpen} 
        onClose={() => { setIsUploadModalOpen(false); setSelectedFile(null); }} 
        title="Upload PYQ / Notes &#x1F4C4;"
      >
        <form className="space-y-4" onSubmit={handleUploadSubmit}>
          <ErrorAlert message={error} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Subject Name</label>
              <input 
                type="text" 
                name="subject"
                placeholder="e.g. Physics" 
                value={pyqForm.subject}
                onChange={handlePyqFormChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" 
                required 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Subject Code</label>
              <input 
                type="text" 
                name="code"
                placeholder="e.g. PHY101" 
                value={pyqForm.code}
                onChange={handlePyqFormChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Exam Type</label>
              <select 
                name="examType"
                value={pyqForm.examType}
                onChange={handlePyqFormChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
              >
                <option>Mid Semester</option>
                <option>End Semester</option>
                <option>Class Test</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Year</label>
              <input 
                type="number" 
                name="year"
                placeholder="e.g. 2024" 
                value={pyqForm.year}
                onChange={handlePyqFormChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none" 
                required 
              />
            </div>
          </div>

          {/* File Upload Area */}
          <div className="space-y-1 pt-2">
            <label className="text-sm font-bold text-gray-700">Upload File (Image or PDF)</label>
            
            <label className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer group">
              <div className="space-y-1 text-center">
                
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <span className="text-4xl mb-2">&#x1F4C4;</span>
                    <p className="text-sm font-bold text-blue-600">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Click to change file</p>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center mt-2">
                      <span className="relative font-medium text-blue-600">Select a file</span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
                  </>
                )}
              </div>
              
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setSelectedFile(e.target.files[0])} 
              />
            </label>
          </div>

          <FormActions
            onCancel={() => { setIsUploadModalOpen(false); setSelectedFile(null); }}
            loading={loading}
            submitLabel="Upload File"
            loadingLabel="Uploading..."
          />
        </form>
      </Modal>

      {/* 2. IMAGE VIEWER MODAL */}
      <Modal 
        isOpen={!!viewPaper} 
        onClose={() => setViewPaper(null)} 
        title={viewPaper ? `${viewPaper.subject} (${viewPaper.year})` : ''}
      >
        {viewPaper && (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center h-[60vh] md:h-[500px]">
              
              {/* PDF ya Image check karne ka logic */}
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
            <div className="w-full flex justify-between items-center bg-blue-50 p-4 rounded-xl">
              <span className="text-sm font-semibold text-blue-800">Need this for later?</span>
              {viewPaper.fileUrl ? (
              <a 
                href={viewPaper.fileUrl.replace('/upload/', '/upload/fl_attachment/')}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors"
              >
                Download
              </a>
              ) : (
                <span className="text-sm text-gray-400 font-medium">No file to download</span>
              )}
            </div>
          </div>
        )}
      </Modal>
    </PageLayout>
  );
};

export default Academic;
