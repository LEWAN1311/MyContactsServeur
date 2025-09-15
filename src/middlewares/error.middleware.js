const errorHandle = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    const code = err.code || null;

    res.status(status).json({
        ok: false,
        error: {
            status,
            message,
            ...(code ? { code } : {})
        }
    });
}

module.exports = errorHandle;