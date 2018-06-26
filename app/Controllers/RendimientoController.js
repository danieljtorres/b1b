'use strict';

const Controller = require("app/Controllers/Controller");

const RendimientoRepo = require("app/Repositories/RendimientoRepo");

class RendimientoController extends Controller {

    generar() {
        RendimientoRepo.generar((err, datos) => {
            if (err) return console.log({data: null, err: err});

            //if (!datos.length) return console.log({data: []});

            return console.log({data: datos})
        })
    }
}

module.exports = new RendimientoController;