export class AppError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const createError = (statusCode, message, details = null) => {
  return new AppError(statusCode, message, details);
};

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error
  console.error({
    status: err.status,
    message: err.message,
    stack: err.stack,
    details: err.details,
  });

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      details: err.details,
    });
  } else {
    // Production error response
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};