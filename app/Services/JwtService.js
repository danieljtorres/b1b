'use strict';

const authConfig = require('config/auth'),
    jwt          = require('jsonwebtoken'),
    moment       = require('moment');

module.exports = {

    crearToken: (data, rol) => {
        data.rol = rol;

        const playload = {
            data: data,
            rol: rol,
            iat: moment().unix(),
            exp: moment().add(authConfig.exp.qty, authConfig.exp.unit).unix()
        }

        return jwt.sign(playload, authConfig.secretKey);
    },

    decodificar: (token, cb) => {

        let decoded

        try {
            decoded = jwt.verify(token, authConfig.secretKey);
        } catch(err) {
            return cb(err);
        }

        return cb(null, decoded);
    }
}