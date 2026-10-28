class AppError extends Error{
    constructor(message, statusCode = 500, details = null){
        super(message);
        this.name = this.contructor.name;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperacional = true;
        this.details = details;

        Error.captureStackTrace(this, this.contructor);
    }
}

module.exports = AppError;