
function errorHandler() {
    return async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.status = err.status || 500;
            ctx.body = {
                success: false,
                message: err.message || 'Internal server error'
            };
        }
    }
}

module.exports = errorHandler;