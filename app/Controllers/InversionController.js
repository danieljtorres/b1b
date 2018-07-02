'use strict';

const Controller = require("app/Controllers/Controller");

const InversionRepo = require("app/Repositories/InversionRepo");

class InversionController extends Controller {

    solicitudes(req, res) {
        InversionRepo.solicitudes((err, datos) => {
            if (err) return res.status(500).json({data: null, err: err.message});

            if (!datos.datos.length) return res.status(404).json({data: []});

            if (datos.cabeceras) res.set(datos.cabeceras);

            return res.status(200).json({data: datos.datos})
        })
    }

    todosPorUsuario(req, res) {
        InversionRepo.todosPorUsuario(req, (err, datos) => {
            if (err) return res.status(500).json({data: null, err: err.message});

            if (!datos.datos.length) return res.status(404).json({data: []});

            if (datos.cabeceras) res.set(datos.cabeceras);

            return res.status(200).json({data: datos.datos})
        })
    }

    historial(req, res) {
        InversionRepo.historial(req, (err, datos) => {
            if (err) return res.status(500).json({data: null, err: err.message});

            if(super.checkError(datos)) {
                err = super.getError(datos);
                return res.status(err.status).json({data: null, message: err.msg});
            }

            return res.status(200).json({data: datos})
        })
    }

    guardar(req, res) {

        console.log(req)

        InversionRepo.guardar(req, (err, datos) => {
            if (err) return res.status(err.status || 500).json({data: null, err: err.message});

            if(super.checkError(datos)) {
                err = super.getError(datos);
                return res.status(err.status).json({data: null, message: err.msg});
            }

            return res.status(200).json({data: datos})
        })
    }

    aprobar(req, res) {
        InversionRepo.aprobar(req, (err, datos) => {
            if (err) return res.status(err.status || 500).json({data: null, err: err.message});

            if(super.checkError(datos)) {
                err = super.getError(datos);
                return res.status(err.status).json({data: null, message: err.msg});
            }

            return res.status(200).json({data: datos})
        })
    }

    cobrar(req, res) {
        InversionRepo.cobrar(req, (err, datos) => {
            if (err) return res.status(err.status || 500).json({data: null, err: err.message});

            if(super.checkError(datos)) {
                err = super.getError(datos);
                return res.status(err.status).json({data: null, message: err.msg});
            }

            return res.status(200).json({data: datos})
        })
    }

}

module.exports = new InversionController;