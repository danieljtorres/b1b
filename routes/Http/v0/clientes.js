'use strict';

const Router    = require("express").Router(),
    Controllers = require("app/Controllers"),
    Middlewares = require("app/Middlewares");

/**
 * MIDDLEWARES GLOBALES
 */
//Router.use(Middlewares);

/**
 * GET
 */

/**
 * POST
 */
Router.post('/', Controllers.ClienteController.guardar);

/**
 * PUT
 */
//Router.put('/', Controllers.ClienteController);

 /**
 * DELETE
 */
//Router.delete('/', Controllers.ClienteController);

module.exports = Router;