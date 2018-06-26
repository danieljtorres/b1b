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
Router.get('/', Controllers.PlanController.todos);
Router.get('/inversiones', Controllers.PlanController.inversiones);
Router.get('/asociaciones', Controllers.PlanController.asociaciones);

/**
 * POST
 */
Router.post('/',  auth([1,2]), Controllers.PlanController.guardar);

/**
 * PUT
 */
//Router.put('/', Controllers.PlanController);

/**
 * DELETE
 */
Router.delete('/:id', auth([1,2]), Controllers.PlanController.borrar);

module.exports = Router;