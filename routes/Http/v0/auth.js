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
Router.get('/', auth(), Controllers.AuthController.datos);
Router.get('/referidos', auth([3]), Controllers.UsuarioController.referidosPorUsuario);
Router.get('/beneficiarios', auth([3]), Controllers.BeneficiarioController.todosPorUsuario);
Router.get('/inversiones/:estado?', auth([3]), Controllers.InversionController.todosPorUsuario);
Router.get('/inversiones/:id/historial', auth([3]), Controllers.InversionController.historial);
Router.get('/activar/:codigo', auth([3]), Controllers.AuthController.activar);

/**
 * POST
 */
Router.post('/', Controllers.AuthController.login);

/**
 * PUT
 */
Router.put('/', auth(), Controllers.UsuarioController.editar);
Router.put('/avatar', auth(), Controllers.UsuarioController.cambiarAvatar);
Router.put('/documento', auth([3]), Controllers.ClienteController.subirDocumento);

/**
 * DELETE
 */
//Router.delete('/', auth(), Controllers.AuthController.borrar);

module.exports = Router;