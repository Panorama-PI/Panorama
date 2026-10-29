const httpErrorNames = {
  400: 'Bad Request',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  500: 'Internal Server Error',
};

// Interceptor global de erros de requisições
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.AMBIENTE_PROCESSO === "producao";

  console.error(`[${new Date().toISOString()}] Erro em ${req.method} ${req.orginalUrl}:`, {
    message: err.message,
    stack: isProduction ? undefined : err.stack,
  });

  // O nome do erro: usa o 'name' da classe (ex.: NotFoundError) ou o texto padrão HTTP
  const errorTitle = err.name && err.name !== 'Error' 
    ? err.name 
    : (httpErrorNames[statusCode] || 'Internal Server Error');

  // Mensagem segura para o cliente
  const errorMessage = err.isOperational || !isProduction
    ? err.message
    : 'Ocorreu um erro interno no servidor.';

  res.status(statusCode).json({
    statusCode,
    error: errorTitle,
    message: errorMessage,
    ...(err.details && { details: err.details }),
    ...(!isProduction && {stack: err.stack}),
  });
}

module.exports = errorHandler;