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
//Router.get('/', Controllers.BeneficiarioController);

/**
 * POST
 */
Router.post('/', auth([3]), Controllers.BeneficiarioController.guardar);

/**
 * PUT
 */
Router.put('/:id', auth([3]), Controllers.BeneficiarioController.editar);

/**
 * DELETE
 */
//Router.delete('/:id', auth([1,2]), Controllers.BeneficiarioController.borrar);

module.exports = Router;