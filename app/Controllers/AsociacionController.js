'use strict';

const Controller = require("app/Controllers/Controller");

const AsociacionRepo = require("app/Repositories/AsociacionRepo");

class AsociacionController extends Controller {

    solicitudes(req, res) {
        AsociacionRepo.solicitudes((err, datos) => {
            if (err) return res.status(500).json({data: null, err: err.message});

            if (!datos.length) return res.status(404).json({data: []});

            return res.status(200).json({data: datos})
        })
    }

    guardar(req, res) {
        AsociacionRepo.guardar(req, (err, datos) => {
            if (err) return res.status(err.status || 500).json({data: null, err: err.message});

            if(super.checkError(datos)) {
                err = super.getError(datos);
                return res.status(err.status).json({data: null, message: err.msg});
            }

            return res.status(200).json({data: datos})
        })
    }

    aprobar(req, res) {
        AsociacionRepo.aprobar(req, (err, datos) => {
            if (err) return res.status(err.status || 500).json({data: null, err: err.message});

            if(super.checkError(datos)) {
                err = super.getError(datos);
                return res.status(err.status).json({data: null, message: err.msg});
            }

            return res.status(200).json({data: datos})
        })
    }
}

module.exports = new AsociacionController;