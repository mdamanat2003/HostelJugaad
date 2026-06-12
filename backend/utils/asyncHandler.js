const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.error(`${fn.name || 'Handler'} Error:`, error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  });
};

export default asyncHandler;
