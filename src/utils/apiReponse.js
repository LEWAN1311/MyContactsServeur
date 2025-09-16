class ApiError extends Error {
    constructor(status, message, code) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        Error.captureStackTrace && Error.captureStackTrace(this, ApiError);
    }
}

module.exports = ApiError;