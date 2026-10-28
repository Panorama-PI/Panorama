const AppError = require("AppError");

class ConflictError extends AppError{
    constructor(message = 'Conflito de dados (Registro já existente).'){
        super(message, 409);
    }
}

module.exports = ConflictError;