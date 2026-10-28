const AppError = require("AppError");

//Sintaxe inválida, campos ausentes obrigatórios ou tipos incompatíveis (ex.: texto onde se esperava número).
class BadRequestError extends AppError{
    constructor(message = "Requisição invalida.", details = null){
        super(message, 400, details);
    }
}



module.exports = BadRequestError;