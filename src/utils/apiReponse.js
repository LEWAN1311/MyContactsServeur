const ApiError = (status, message, code) => {
        Error.call(this, message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        Error.captureStackTrace && Error.captureStackTrace(this, ApiError);
}
ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.constructor = ApiError;

module.exports = ApiError;