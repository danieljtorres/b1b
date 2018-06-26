'use strict';

const Controller = require("app/Controllers/Controller");

const UsuarioRepo = require("app/Repositories/UsuarioRepo");

class AuthController extends Controller {

    login(req, res) {
        UsuarioRepo.login(req, (err, datos) => {
            if (err) return res.status(err.status || 500).json({data: null, err: err.message});

            if(super.checkError(datos)) {
                err = super.getError(datos);
                return res.status(err.status).json({data: null, message: err.msg});
            }

            return res.status(200).json({data: datos.token})
        })
    }

    activar(req, res) {
        UsuarioRepo.activar(req, (err, datos) => {
            if (err) return res.status(err.status || 500).json({data: null, err: err.message});

            if(super.checkError(datos)) {
                err = super.getError(datos);
                return res.status(err.status).json({data: null, message: err.msg});
            }

            return res.status(200).json({data: datos})
        })
    }

    datos(req, res) {
        UsuarioRepo.datos(req, (err, datos) => {
            if (err) return res.status(err.status || 500).json({data: null, err: err.message});

            if(super.checkError(datos)) {
                err = super.getError(datos);
                return res.status(err.status).json({data: null, message: err.msg});
            }

            return res.status(200).json({data: datos})
        })
    }
}

module.exports = new AuthController;