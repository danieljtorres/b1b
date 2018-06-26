'use strict';

const Controller = require("app/Controllers/Controller");

const PaisRepo = require("app/Repositories/PaisRepo");

class PaisController extends Controller {

    todos(req, res) {
        PaisRepo.todos((err, datos) => {
            if (err) return res.status(500).json({data: null, err: err});

            if (!datos.length) return res.status(404).json({data: []});

            return res.status(200).json({data: datos})
        })
    }
}

module.exports = new PaisController;