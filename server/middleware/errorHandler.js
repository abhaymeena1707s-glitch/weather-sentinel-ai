const errorHandler = (err, req, res, next) => {
  console.error('Server Error:', err.stack || err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
