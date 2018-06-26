'use strict';

const Controller = require("app/Controllers/Controller");

const BeneficiarioRepo = require("app/Repositories/BeneficiarioRepo");

class BeneficiarioController extends Controller {

    todosPorUsuario(req, res) {
        BeneficiarioRepo.todosPorUsuario(req, (err, datos) => {
            if (err) return res.status(500).json({data: null, err: err.message});

            if (!datos.length) return res.status(404).json({data: []});

            return res.status(200).json({data: datos})
        })
    }

    guardar(req, res) {
        BeneficiarioRepo.guardar(req, (err, datos) => {
            if (err) return res.status(err.status || 500).json({data: null, err: err.message});

            if(super.checkError(datos)) {
                err = super.getError(datos);
                return res.status(err.status).json({data: null, message: err.msg});
            }

            return res.status(200).json({data: datos})
        })
    }

    editar(req, res) {
        BeneficiarioRepo.editar(req, (err, datos) => {
            if (err) return res.status(err.status || 500).json({data: null, err: err.message});

            if(super.checkError(datos)) {
                err = super.getError(datos);
                return res.status(err.status).json({data: null, message: err.msg});
            }

            return res.status(200).json({data: datos})
        })
    }
}

module.exports = new BeneficiarioController;