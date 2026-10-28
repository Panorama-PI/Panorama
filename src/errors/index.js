//O Index.js centraliza todos os erros

const AppError = require("AppError");
const BadRequestError = require("BadRequestError");
const ConflictError = require("ConflictError");
const InternalServerError = require("InternalServerError");
const NotFoundError = require("NotFoundError");
const ValidationError = require("ValidationError");

module.exports = {
    AppError,
    BadRequestError,
    ConflictError,
    InternalServerError,
    NotFoundError,
    ValidationError
}
