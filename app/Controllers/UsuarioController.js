'use strict';

const Controller = require('app/Controllers/Controller');

const UsuarioRepo = require("app/Repositories/UsuarioRepo");

class UsuarioController extends Controller {

    todos(req, res) {
        UsuarioRepo.todos((err, datos) => {
            if (err) return res.status(500).json({data: null, err: err.message});

            if (!datos.datos.length) return res.status(404).json({data: []});

            if (datos.cabeceras) res.set(datos.cabeceras);

            return res.status(200).json({data: datos.datos})
        })
    }

    admins(req, res) {
        UsuarioRepo.admins(req, (err, datos) => {
            if (err) return res.status(500).json({data: null, err: err.message});

            if (!datos.datos.length) return res.status(404).json({data: []});

            if (datos.cabeceras) res.set(datos.cabeceras);

            return res.status(200).json({data: datos.datos})
        })
    }

    clientes(req, res) {
        UsuarioRepo.clientes(req, (err, datos) => {
            if (err) return res.status(500).json({data: null, err: err.message});

            if (!datos.datos.length) return res.status(404).json({data: []});

            if (datos.cabeceras) res.set(datos.cabeceras);

            return res.status(200).json({data: datos.datos})
        })
    }

    asociados(req, res) {
        UsuarioRepo.asociados(req, (err, datos) => {
            if (err) return res.status(500).json({data: null, err: err.message});

            if (!datos.datos.length) return res.status(404).json({data: []});

            if (datos.cabeceras) res.set(datos.cabeceras);

            return res.status(200).json({data: datos.datos})
        })
    }

    referidosPorUsuario(req, res) {
        UsuarioRepo.referidosPorUsuario(req, (err, datos) => {
            if (err) return res.status(500).json({data: null, err: err.message});

            if (!datos.datos.length) return res.status(404).json({data: []});

            if (datos.cabeceras) res.set(datos.cabeceras);

            return res.status(200).json({data: datos.datos})
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