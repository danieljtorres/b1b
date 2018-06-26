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
Router.get('/', Middlewares.AuthorizationMiddleware.auth(), Controllers.AuthController.datos);
Router.get('/activar/:codigo', Controllers.AuthController.activar);

/**
 * POST
 */
Router.post('/', Controllers.AuthController.login);

/**
 * PUT
 */
Router.put('/', Middlewares.AuthorizationMiddleware.auth(), Controllers.UsuarioController.editar);
Router.put('/avatar', Middlewares.AuthorizationMiddleware.auth(), Controllers.UsuarioController.cambiarAvatar);

Router.put('/documento', Middlewares.AuthorizationMiddleware.auth([3]), Controllers.ClienteController.subirDocumento);

/**
 * DELETE
 */
//Router.delete('/', Middlewares.AuthorizationMiddleware.auth(), Controllers.AuthController.borrar);

module.exports = Router;