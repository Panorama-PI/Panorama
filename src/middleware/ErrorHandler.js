const httpErrorNames = {
  400: 'Bad Request',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  500: 'Internal Server Error',
  401: 'Unauthorized', // Adicionado para cobrir a classe que criamos
  403: 'Forbidden',    // Adicionado para cobrir a classe que criamos
  413: 'Payload Too Large',
  415: 'Unsupported Media Type'
};

// Interceptor global de erros de requisições
const errorHandler = (err, req, res, next) => {
  // O Express/body-parser costuma preencher `status` (por exemplo, JSON
  // malformado), enquanto os erros da aplicação usam `statusCode`.
  const statusCode = Number(err.statusCode || err.status) || 500;
  const isProduction = process.env.AMBIENTE_PROCESSO === "producao";

  if (res.headersSent) {
    return next(err);
  }

  console.error(`[${new Date().toISOString()}] Erro em ${req.method} ${req.originalUrl}:`, {
    message: err.message,
    stack: isProduction ? undefined : err.stack,
  });

  // O nome do erro: usa o 'name' da classe (ex.: NotFoundError) ou o texto padrão HTTP
  const errorTitle = err.name && err.name !== 'Error' 
    ? err.name 
    : (httpErrorNames[statusCode] || 'Internal Server Error');

  // Mensagem segura para o cliente
  // Não exponha detalhes de falhas 5xx, mesmo quando encapsuladas em
  // InternalServerError (que também é marcado como operacional).
  const errorMessage = (!isProduction || (err.isOperational && statusCode < 500))
    ? err.message
    : 'Ocorreu um erro interno no servidor.';

  res.status(statusCode).json({
    statusCode,
    error: errorTitle,
    message: errorMessage,
    ...(err.details && (!isProduction || statusCode < 500) && { details: err.details }),
    ...(!isProduction && {stack: err.stack}),
  });
}

module.exports = errorHandler;
