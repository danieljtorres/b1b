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
Router.get('/', Controllers.PaisController.todos);

/**
 * POST
 */
//Router.post('/',  Middlewares.AuthorizationMiddleware.auth([1,2]), Controllers.PaisController.guardar);

/**
 * PUT
 */
//Router.put('/', Controllers.PaisController);

/**
 * DELETE
 */
//Router.delete('/:id', Middlewares.AuthorizationMiddleware.auth([1,2]), Controllers.PaisController.borrar);

module.exports = Router;