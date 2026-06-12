export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    localStorage.removeItem('user');
    return {};
  }
};

export const buildFormData = (fields, fileEntry) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  if (fileEntry) {
    formData.append(fileEntry.fieldName, fileEntry.file);
  }
  return formData;
};
