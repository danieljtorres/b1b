'use strict';

const sq = require('app/Models/sequelize');

const authConfig = require('config/auth'),
    JwtService   = require('app/Services').JwtService,
    moment       = require('moment'),
    passwordHash = require('password-hash');

module.exports = {
    
    auth: (roles = []) => {
        return (req, res, next) => {

            if (authConfig.enabled) {

                if(!req.headers.authorization){
                    return res.status(403).json({
                        message: "#1 TOKEN NO ENVIADO. No autorizado "+ req.method + ": " + req.originalUrl 
                    })
                }
                
                const token = req.headers.authorization

                JwtService.decodificar(token, async function(err, decoded) {

                    if  ( err ){
                        return res.status(401).json({
                            message: "#2 2TOKEN INVALIDO. No autorizado "+ req.method + ": " + req.originalUrl
                        });
                    }

                    if ( decoded.exp <= moment().unix() ){
                        return res.status(401).json({
                            message: "#3 TOKEN EXPIRADO. No autorizado "+ req.method + ": " + req.originalUrl
                        })
                    }

                    let usuario = await sq.Usuario.findById( decoded.data.id );

                    if ( usuario == null ) {
                        return res.status(401).json({
                            message: "#4 USUARIO NO ENCONTRADO "+ req.method + ": " + req.originalUrl
                        });
                    }

                    if ( roles.indexOf(usuario.rol_id) == -1 && roles.length ){
                        return res.status(401).json({
                            message: "#5 ROL (" + decoded.rol + ") SIN PERMISOS. No autorizado "+ req.method + ": " + req.originalUrl
                        });
                    }

                    req.auth = decoded.data
                    next();
                })

            } else {

                req.auth = {id: 1, rol:  1};
                next();

            }
        }
    },

    checkCode: (roles = []) => {

        return (req, res, next) => {

            if (authConfig.enabled) {

                if(!req.headers.authorization){
                    return res.status(403).json({
                        message: "#1 TOKEN NO ENVIADO. No autorizado "+ req.method + ": " + req.originalUrl 
                    })
                }
                
                const token = req.headers.authorization

                JwtService.decodificar(token, (err, decoded) => {

                    if (err){
                        return res.status(401).json({
                            message: "#2 TOKEN INVALIDO. No autorizado "+ req.method + ": " + req.originalUrl
                        });
                    }

                    if (decoded.exp <= moment().unix()){
                        return res.status(401).json({
                            message: "#3 TOKEN EXPIRADO. No autorizado "+ req.method + ": " + req.originalUrl
                        })
                    }

                    if (roles.indexOf(decoded.rol) == -1){
                        return res.status(401).json({
                            message: "#4 ROL (" + decoded.rol + ") SIN PERMISOS. No autorizado "+ req.method + ": " + req.originalUrl
                        });
                    }

                    req.auth = decoded.data
                    next();
                })

            } else {

                req.auth = {id: 1, rol:  1};
                next();

            }

        }
    }

}