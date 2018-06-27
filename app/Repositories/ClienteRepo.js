'use strict';

const sq = require('app/Models/sequelize');
const sequelize = sq.sequelize
const Sequelize = sq.Sequelize;
const Op = sq.Sequelize.Op;

const emailService = require('app/Services/EmailService');

const _he          = require('app/Helpers');
const passwordHash = require('password-hash');
const moment       = require('moment');
const fs = require('fs');
class ClienteRepo {

    async guardar(req, cb) {
        
        let body  = req.body,
            query = req.query;

        let usuarioDatos = {
            rol_id: 3,
            usuario: body.usuario,
            email: body.email,
            password: body.password,
            codigo: _he.randomStr(16),
            avatar: fs.readFileSync(__basePath + '/resources/avatares/default.txt')
        }

        let clienteDatos = {
            pais_id: body.pais_id,
            nombres: body.nombres,
            apellidos: body.apellidos,
            telefono: body.telefono,
            identificacion: body.identificacion
        }

        let transaction = null,
            usuarioReferencia,
            asociacion,
            usuario,
            cliente;

        if (query.referencia) {
            try {
                usuarioReferencia = await sq.Usuario.findOne({
                    where: { usuario: query.referencia }
                })

                if (usuarioReferencia == null) {
                    cb(null, 'USUARIO_NO_ENCONTRADO');
                    return null;
                }

                if (!usuarioReferencia.activo) {
                    cb(null, 'USUARIO_NO_ACTIVO');
                    return null;
                }

                asociacion = await sq.Asociacion.findOne({
                    where: { 
                        usuario_id: usuarioReferencia.id, 
                        aprobado: { [Op.ne]: null }
                    }
                })

                if (asociacion == null) {
                    cb(null, 'ASOCIACION_NO_ENCONTRADA');
                    return null;
                }

                transaction = await sequelize.transaction();

                if (asociacion.inicio == null) {
                    asociacion.inicio = moment().format("YYYY-MM-DD HH:mm:ss");
                    await asociacion.update({inicio: moment().format("YYYY-MM-DD HH:mm:ss")}, {silent:true, transaction});
                }

                usuarioDatos.referencia = usuarioReferencia.id;
            } catch (err) {
                console.log(err)

                if (transaction != null) {
                    await transaction.rollback();
                }
                
                cb(err);
                return null;
            }
        }

        try {
            if (transaction == null) {
                transaction = await sequelize.transaction();
            }

            usuario = await sq.Usuario.create(usuarioDatos, { include: [{ model: sq.Cliente, as: '_cliente' }] , silent: true, transaction});

            clienteDatos.usuario_id = usuario.id;
        } catch (err) {
            await transaction.rollback();

            if (err.name == "SequelizeValidationError") err.status = 400;

            cb(err);
            return null;
        }

        try {
            cliente = await sq.Cliente.create(clienteDatos, { 
                include: [
                    { model: sq.Usuario, as: '_usuario' }, 
                    { model: sq.Pais, as: '_pais' }
                ] 
            , transaction });

            // Enviar email de nueva referencia a usuario de referencia
            if (usuario.referencia != null) {
                emailService.setMssg({
                    to: usuarioReferencia.email,
                    subject: 'B1B | Tienes un nuevo referenciado!',
                }).setData({
                    usuario: usuario.usuario
                }).setHtml('nuevo-referenciado');

                await emailService.send();
            }

            // Enviar email de confirmacion a usuario
            emailService.setMssg({
                to: usuario.email,
                subject: 'B1B | Confirmar registro!',
            }).setData({
                usuario: usuario.usuario
            }).setHtml('confirmar-registro');
            
            await emailService.send();

            await transaction.commit();

            await cliente.reload();
        } catch (err) {
            await transaction.rollback();

            if (err.name == "SequelizeValidationError") err.status = 400;

            cb(err);
            return null;
        }

        cb(null, cliente.toJSON());
    }

    async subirDocumento(req, cb) {

        const auth = req.auth;
        const documento = req.files.documento;

        let transaction, cliente;

        if (documento.type.indexOf('image') == -1) {
            cb(null, 'FORMATO_INVALIDO');
            return null;  
        }

        const nombreDocumento = _he.randomStr(16) + '_' + auth.id + '.' + documento.type.split('/')[1];
        const temporal        = documento.path;
        const pathObjetivo    = '/resources/documentos/' ;

        try {
            transaction = await sequelize.transaction();

            cliente = await sq.Cliente.findById( auth.id, transaction)

            if (cliente == null) {
                cb(null, 'USUARIO_NO_ENCONTRADO');
                return null;
            }

            await _he.uploadFile(temporal, pathObjetivo, nombreDocumento)

            await cliente.update({documento: nombre}, transaction);

            await transaction.commit();

            await cliente.reload();

            await _he.deleteFile(pathObjetivo + cliente.documento);
        } catch (err) {
            await transaction.rollback();

            if (err.name == "SequelizeValidationError") err.status = 400;

            await _he.deleteFile(pathObjetivo + nombreDocumento);

            cb(err);
            return null;
        }

        cb(null, cliente.toJSON());
    }
}

module.exports = new ClienteRepo;