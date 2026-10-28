const AppError = require("AppError");

class ValidationError extends AppError{
    constructor(message = 'Falha na validação dos campos.', details = null){
        super(message, 422, details);
    }
}

module.exports = ValidationError;