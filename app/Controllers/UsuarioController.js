'use strict';

const Controller = require('app/Controllers/Controller');

const UsuarioRepo = require("app/Repositories/UsuarioRepo");

class UsuarioController extends Controller {

    todos(req, res) {
        UsuarioRepo.todos((err, datos) => {
            if (err) return res.status(500).json({data: null, err: err.message});

            if (!datos.length) return res.status(404).json({data: []});

            return res.status(200).json({data: datos})
        })
    }

    admins(req, res) {
        UsuarioRepo.admins((err, datos) => {
            if (err) return res.status(500).json({data: null, err: err.message});

            if (!datos.length) return res.status(404).json({data: []});

            return res.status(200).json({data: datos})
        })
    }

    clientes(req, res) {
        UsuarioRepo.clientes((err, datos) => {
            if (err) return res.status(500).json({data: null, err: err.message});

            if (!datos.length) return res.status(404).json({data: []});

            return res.status(200).json({data: datos})
        })
    }

    asociados(req, res) {
        UsuarioRepo.asociados((err, datos) => {
            if (err) return res.status(500).json({data: null, err: err.message});

            if (!datos.length) return res.status(404).json({data: []});

            return res.status(200).json({data: datos})
        })
    }

    referidosPorUsuario(req, res) {
        UsuarioRepo.referidosPorUsuario(req, (err, datos) => {
            if (err) return res.status(500).json({data: null, err: err.message});

            if (!datos.length) return res.status(404).json({data: []});

            return res.status(200).json({data: datos})
        })
    }

    guardar(req, res) {
        UsuarioRepo.guardar(req, (err, datos) => {
            if (err) return res.status(err.status || 500).json({data: null, err: err.message});
            
            return res.status(200).json({data: datos})
        })
    }

    editar(req, res) {
        UsuarioRepo.editar(req, (err, datos) => {
            if (err) return res.status(err.status || 500).json({data: null, err: err.message});

            if(super.checkError(datos)) {
                err = super.getError(datos);
                return res.status(err.status).json({data: null, message: err.msg});
            }

            return res.status(200).json({data: datos})
        })
    }

    cambiarAvatar(req, res) {
        UsuarioRepo.cambiarAvatar(req, (err, datos) => {
            if (err) return res.status(err.status || 500).json({data: null, err: err.message});

            if(super.checkError(datos)) {
                err = super.getError(datos);
                return res.status(err.status).json({data: null, message: err.msg});
            }

            return res.status(200).json({data: datos})
        })
    }

    borrar(req, res) {
        UsuarioRepo.borrar(req, (err, datos) => {
            if (err) return res.status(err.status || 500).json({data: null, err: err.message});

            if(super.checkError(datos)) {
                err = super.getError(datos);
                return res.status(err.status).json({data: null, message: err.msg});
            }

            return res.status(200).json({data: datos})
        })
    }
}

module.exports = new UsuarioController;