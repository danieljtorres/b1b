'use strict';

const Controller = require("app/Controllers/Controller");

const PlanRepo = require("app/Repositories/PlanRepo");

class PlanController extends Controller {

    todos(req, res) {
        PlanRepo.todos((err, datos) => {
            if (err) return res.status(500).json({data: null, err: err});

            if (!datos.length) return res.status(404).json({data: []});

            return res.status(200).json({data: datos})
        })
    }

    inversiones(req, res) {
        PlanRepo.inversiones((err, datos) => {
            if (err) return res.status(500).json({data: null, err: err.message});

            if (!datos.length) return res.status(404).json({data: []});

            return res.status(200).json({data: datos})
        })
    }

    asociaciones(req, res) {
        PlanRepo.asociaciones((err, datos) => {
            if (err) return res.status(500).json({data: null, err: err.message});

            if (!datos.length) return res.status(404).json({data: []});

            return res.status(200).json({data: datos})
        })
    }


    guardar(req, res) {
        PlanRepo.guardar(req, (err, datos) => {
            if (err) return res.status(err.status || 500).json({data: null, err: err});
            return res.status(200).json({data: datos})
        })
    }

    borrar(req, res) {
        PlanRepo.borrar(req, (err, datos) => {
            if (err) return res.status(err.status || 500).json({data: null, err: err.message});

            if(super.checkError(datos)) {
                err = super.getError(datos);
                return res.status(err.status).json({data: null, message: err.msg});
            }

            return res.status(200).json({data: datos})
        })
    }
}

module.exports = new PlanController;