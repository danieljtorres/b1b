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
Router.get('/', auth([1]), Controllers.UsuarioController.todos);
Router.get('/administradores', auth([1]), Controllers.UsuarioController.admins);
Router.get('/clientes', auth([1,2]), Controllers.UsuarioController.clientes);
Router.get('/asociados', auth([1,2]), Controllers.UsuarioController.asociados);
Router.get('/:id/referidos', auth([1,2]), Controllers.UsuarioController.referidosPorUsuario);
Router.get('/:id/beneficiarios', auth([1,2]), Controllers.BeneficiarioController.todosPorUsuario);
Router.get('/:id/inversiones/:estado?', auth([1,2]), Controllers.InversionController.todosPorUsuario);

/**
 * POST
 */
Router.post('/', auth([1]), Controllers.UsuarioController.guardar);

/**
 * PUT
 */
Router.put('/:id', auth([1,2]), Controllers.UsuarioController.editar);

/**
 * DELETE
 */
Router.delete('/:id', auth([1]), Controllers.UsuarioController.borrar);

module.exports = Router;