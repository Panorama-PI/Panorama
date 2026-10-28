const AppError = require("AppError");

class InternalServerError extends AppError{
    constructor(message = "Erro interno do servidor", details = null){
        super(message, 500, details);
    }
}

module.exports = InternalServerError;