'use strict';

const Router    = require("express").Router(),
    Controllers = require("app/Controllers"),
    Middlewares = require("app/Middlewares");

/**
 * MIDDLEWARES GLOBALES
 */
//Router.use(Middlewares);

const emailService = require('app/Services/EmailService');

/**
 * GET
 */
Router.get('/', async (req, res) => {

    emailService.setMssg({
        to: 'danieljtorres94@gmail.com',
        subject: 'B1B | Prueba',
    }).setData({
        msg: "Esto es una prueba de correo"
    }).setHtml('prueba');

    try {
        await emailService.send();
        res.status(200).json({msg: "Hola mundo"}) 
    } catch (error) {
        res.status(200).json({msg: error}) 
    }
    
});

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