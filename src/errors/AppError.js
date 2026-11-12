//Qualquer falha inesperada no servidor, 
//queda de banco de dados ou bug no código. 
//Este erro é capturado automaticamente pelo nosso handler global para não derrubar a aplicação nem expor dados sensíveis do servidor.

class AppError extends Error{
    constructor(message, statusCode = 500, details = null){
        super(message);
        this.name = this.constructor ? this.constructor.name : 'AppError';
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperacional = true;
        this.details = details;

        if (Error.captureStackTrace) {
              Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = AppError;