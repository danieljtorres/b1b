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
Router.get('/', Middlewares.AuthorizationMiddleware.auth(), Controllers.InversionController.todos);

/**
 * POST
 */
Router.post('/', Middlewares.AuthorizationMiddleware.auth([3]), Controllers.InversionController.guardar);

/**
 * PUT
 */
Router.put('/:id', Middlewares.AuthorizationMiddleware.auth([1,2]), Controllers.InversionController.aprobar);

/**
 * DELETE
 */
//Router.delete('/', Middlewares.AuthorizationMiddleware.auth(), Controllers.InversionController.borrar);

module.exports = Router;