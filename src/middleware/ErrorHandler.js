// Interceptor global de erros de requisições
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.AMBIENTE_PROCESSO === "producao";

  console.error(`[${new Date().toISOString()}] Erro em ${req.method} ${req.orginalUrl}:`, {
    message: err.message,
    stack: isProduction ? undefined : err.stack,
  });

  res.status(statusCode).json({
    status: err.status || "error",
    message: err.isOperacional || !isProduction
      ? err.message
      : "Ocorreu um erro interno no servidor. ",
    ...(err.details && { details: err.details }),
    ...(!isProduction && {stack: err.stack}),
  });
}

module.exports = errorHandler;