'use strict'

const Errors = require("app/Errors");

module.exports = class Controller {
    checkError(datos) { return Errors.check(datos) };
    getError(datos) { return Errors.get(datos) };
}