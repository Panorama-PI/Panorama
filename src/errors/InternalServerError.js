const AppError = require("AppError");

//Falhas imprevistas, queda de banco de dados ou erros de código não tratados.
class InternalServerError extends AppError{
    constructor(message = "Erro interno do servidor", details = null){
        super(message, 500, details);
    }
}

module.exports = InternalServerError;