import { useState, useCallback } from 'react';

const useAsyncData = (initialData = []) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = useCallback(async (asyncFn) => {
    setLoading(true);
    try {
      const response = await asyncFn();
      setData(response.data);
      setError('');
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, setData, loading, setLoading, error, setError, execute };
};

export default useAsyncData;
