'use strict';

const sq = require('app/Models/sequelize');
const sequelize = sq.sequelize
const Sequelize = sq.Sequelize;
const Op = sq.Sequelize.Op;

const _he          = require('app/Helpers');
const passwordHash = require('password-hash');
const moment       = require('moment');

class BeneficiarioRepo {
    
    async obtener(req, cb) {

        let params = req.params;

        let beneficiario;

        try {
            beneficiario = await sq.Beneficiario.findById(params.id, {
                include: [
                    { model: sq.Cliente, as: '_cliente', include: [
                            { model: sq.Usuario, as: '_usuario' }
                        ]
                    }
                ] 
            });
        } catch (err) {
            cb(err, null);
            return null;
        }

        cb(null, beneficiario.toJSON());
    }

    async todosPorUsuario(req, cb) {

        const auth = req.auth;
        let params = req.params;

        let cliente, beneficiarios, id;
        
        if (params.id && [1,2].indexOf(auth.rol) != -1) {
            id = params.id;
        } else {
            id = auth.id;
        }

        try {
            cliente = await sq.Cliente.findOne({ where: { usuario_id: id } });
 
            if (cliente == null) {
                cb(null, 'USUARIO_NO_ENCONTRADO');
                return null;
            }

            beneficiarios = await sq.Beneficiario.findAll({ 
                where: { cliente_id: cliente.id },
                include: [
                    { model: sq.Cliente, as: '_cliente', include: [
                            { model: sq.Usuario, as: '_usuario' }
                        ]
                    }
                ] 
            });
        } catch (error) {
            cb(error);
            return null;
        }

        cb(null, beneficiarios);  
    }

    async guardar(req, cb) {

        const auth = req.auth;
        let body = req.body;
            //files = req.files;

        let transaction, cliente, beneficiario;

        
        /*if (!files.documento) {
            cb(null, 'CAMPO_OBLIGATORIO');
            return null; 
        }

        if (files.documento.type.indexOf('image') == -1) {
            cb(null, 'FORMATO_INVALIDO');
            return null;  
        }

        const nombreDocumento = _he.randomStr(16) + '.' + files.documento.type.split('/')[1];
        const temporal        = files.documento.path;
        const pathObjetivo    = '/resources/documentos/beneficiarios/';*/
    

        let beneficiarioDatos = {
            nombres: body.nombres,
            email: body.email,
            telefono: body.telefono,
            relacion: body.relacion,
            identificacion: body.identificacion,
            //documento: nombreDocumento
        }

        try {
            //await _he.uploadFile(temporal, pathObjetivo, nombreDocumento)

            transaction = await sequelize.transaction();

            cliente = await sq.Cliente.findOne({ where: { usuario_id: auth.id } });

            beneficiarioDatos.cliente_id = cliente.id;

            beneficiario = await sq.Beneficiario.create(beneficiarioDatos, { silent: true, transaction });

            await transaction.commit();

            await beneficiario.reload();
        } catch (err) {
            await transaction.rollback();

            if (err.name == "SequelizeValidationError") err.status = 400;

            //await _he.deleteFile(pathObjetivo + nombreDocumento);

            cb(err);
            return null;
        }

        cb(null, beneficiario.toJSON());
    }

    async editar(req, cb) {

    }
}

module.exports = new BeneficiarioRepo;