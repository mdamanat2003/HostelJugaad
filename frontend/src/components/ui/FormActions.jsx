import React from 'react';

const FormActions = ({ onCancel, loading = false, submitLabel = 'Submit', loadingLabel = 'Submitting...' }) => {
  return (
    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? loadingLabel : submitLabel}
      </button>
    </div>
  );
};

export default FormActions;
