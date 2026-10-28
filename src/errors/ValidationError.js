const AppError = require("AppError");

//Sintaxe correta, mas falha nas regras de negócio/schema (ex.: validação com Zod ou Joi).
class ValidationError extends AppError{
    constructor(message = 'Falha na validação dos campos.', details = null){
        super(message, 422, details);
    }
}

module.exports = ValidationError;