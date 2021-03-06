'use strict';

const Router    = require("express").Router(),
    Controllers = require("app/Controllers"),
    Middlewares = require("app/Middlewares");

const auth = Middlewares.AuthorizationMiddleware.auth;

/**
 * MIDDLEWARES GLOBALES
 */
//Router.use(Middlewares);

/**
 * GET
 */
Router.get('/', auth([1,2]), Controllers.AsociacionController.solicitudes);

/**
 * POST
 */
Router.post('/', auth([3]), Controllers.AsociacionController.guardar);

/**
 * PUT
 */
Router.put('/:id', auth([1,2]), Controllers.AsociacionController.aprobar);

/**
 * DELETE
 */
//Router.delete('/:id', auth([1,2]), Controllers.AsociacionController.borrar);

module.exports = Router;