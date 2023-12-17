class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOpertional = true;
    Error.captureStackTrace(this, this.construcor);
  }
}

module.exports = AppError;
