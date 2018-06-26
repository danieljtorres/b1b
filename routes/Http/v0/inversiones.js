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
Router.get('/', auth([1,2]), Controllers.InversionController.solicitudes);
Router.get('/:id/historial', auth([1,2]), Controllers.InversionController.historial);


/**
 * POST
 */
Router.post('/', auth([3]), Controllers.InversionController.guardar);

/**
 * PUT
 */
Router.put('/:id', auth([1,2]), Controllers.InversionController.aprobar);
Router.put('/:id/cobrar', auth([3]), Controllers.InversionController.cobrar);

/**
 * DELETE
 */
//Router.delete('/', auth(), Controllers.InversionController.borrar);

module.exports = Router;