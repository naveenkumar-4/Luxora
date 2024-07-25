// not found
const notFound = (req, res, next) => {
  const err = new Error(`Not found : ${req.originalUrl}`);
  res.status(404);
  next(err);
};

// Error Handler for API's
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statuscode || 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: err.stack,
  });
};

export { notFound, errorHandler };
