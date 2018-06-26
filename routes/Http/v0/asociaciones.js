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
Router.get('/', Middlewares.AuthorizationMiddleware.auth([1,2]), Controllers.AsociacionController.solicitudes);

/**
 * POST
 */
Router.post('/', Middlewares.AuthorizationMiddleware.auth([3]), Controllers.AsociacionController.guardar);

/**
 * PUT
 */
Router.put('/:id', Middlewares.AuthorizationMiddleware.auth([1,2]), Controllers.AsociacionController.aprobar);

/**
 * DELETE
 */
//Router.delete('/:id', Middlewares.AuthorizationMiddleware.auth([1,2]), Controllers.AsociacionController.borrar);

module.exports = Router;