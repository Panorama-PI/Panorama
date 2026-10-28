const AppError = require("AppError");

//Recurso não existe no banco de dados ou rota inexistente.
class NotFoundError extends AppError{
    constructor(message = 'Recurso não encontrado.'){
        super(message,404);
    }
}

module.exports = NotFoundError;