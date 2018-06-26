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
Router.get('/', Controllers.PlanController.todos);
Router.get('/inversiones', Controllers.PlanController.inversiones);
Router.get('/asociaciones', Controllers.PlanController.asociaciones);

/**
 * POST
 */
Router.post('/',  Middlewares.AuthorizationMiddleware.auth([1,2]), Controllers.PlanController.guardar);

/**
 * PUT
 */
//Router.put('/', Controllers.PlanController);

/**
 * DELETE
 */
Router.delete('/:id', Middlewares.AuthorizationMiddleware.auth([1,2]), Controllers.PlanController.borrar);

module.exports = Router;