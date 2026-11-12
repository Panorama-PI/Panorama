const AppError = require("./AppError");

//Violação de duplicidade (ex.: e-mail ou CPF já cadastrado).
class ConflictError extends AppError{
    constructor(message = 'Conflito de dados (Registro já existente).'){
        super(message, 409);
    }
}

module.exports = ConflictError;