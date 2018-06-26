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
Router.get('/', Middlewares.AuthorizationMiddleware.auth([1]), Controllers.UsuarioController.todos);
Router.get('/administradores', Middlewares.AuthorizationMiddleware.auth([1]), Controllers.UsuarioController.admins);
Router.get('/clientes', Middlewares.AuthorizationMiddleware.auth([1,2]), Controllers.UsuarioController.clientes);
Router.get('/asociados', Middlewares.AuthorizationMiddleware.auth([1,2]), Controllers.UsuarioController.asociados);
Router.get('/:id/referidos', Middlewares.AuthorizationMiddleware.auth([1,2]), Controllers.UsuarioController.referidos);

/**
 * POST
 */
Router.post('/', Middlewares.AuthorizationMiddleware.auth([1]), Controllers.UsuarioController.guardar);

/**
 * PUT
 */
Router.put('/:id', Middlewares.AuthorizationMiddleware.auth([1,2]), Controllers.UsuarioController.editar);

/**
 * DELETE
 */
Router.delete('/:id', Middlewares.AuthorizationMiddleware.auth([1]), Controllers.UsuarioController.borrar);

module.exports = Router;