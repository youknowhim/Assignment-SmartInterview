const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose invalid ID
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID";
  }

  // Duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value";
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = errorHandler;