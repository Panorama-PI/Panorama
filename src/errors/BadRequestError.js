const AppError = require("AppError");

class BadRequestError extends AppError{
    constructor(message = "Requisição invalida.", details = null){
        super(message, 400, details);
    }
}

module.exports = BadRequestError;