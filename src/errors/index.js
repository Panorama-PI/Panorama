//O Index.js centraliza todos os erros

const AppError = require("./AppError");
const BadRequestError = require("./BadRequestError");
const ConflictError = require("./ConflictError");
const InternalServerError = require("./InternalServerError");
const NotFoundError = require("./NotFoundError");
const ValidationError = require("./ValidationError");
const UnauthorizedError = require("./UnauthorizedError");
const ForbiddenError = require("./ForbiddenError");

module.exports = {
    AppError,
    BadRequestError,
    ConflictError,
    InternalServerError,
    NotFoundError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError
}
