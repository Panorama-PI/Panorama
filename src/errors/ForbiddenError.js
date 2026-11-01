const AppError = require("./AppError");

// Erro de autorização (ex.: usuário autenticado, mas não tem permissão para acessar o recurso).
class ForbiddenError extends AppError {
    constructor(message = 'Acesso negado a este recurso.', details = null) {
        super(message, 403, details);
    }
}

module.exports = ForbiddenError;