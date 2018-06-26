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
Router.get('/', (req, res) => res.status(200).json({msg: "Hola mundo"}) );

/**
 * POST
 */
//Router.post('/', Controllers);

/**
 * PUT
 */
//Router.put('/', Controllers);

/**
 * DELETE
 */
//Router.delete('/', Controllers);

module.exports = Router;