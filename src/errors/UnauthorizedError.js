const AppError = require("./AppError");

// Erro de autenticação (ex.: token inválido, token expirado, usuário não logado).
class UnauthorizedError extends AppError {
    constructor(message = 'Acesso não autorizado. Autenticação necessária.', details = null) {
        super(message, 401, details);
    }
}

module.exports = UnauthorizedError;