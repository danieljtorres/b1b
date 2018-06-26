'use strict';

const sq = require('app/Models/sequelize');
const sequelize = sq.sequelize
const Sequelize = sq.Sequelize;
const Op = sq.Sequelize.Op;

const _he          = require('app/Helpers');

class BeneficiarioRepo {
    
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

            if (beneficiario == null) {
                cb(null, 'BENEFICIARIO_NO_ENCONTRADO');
                return null;
            } 
        } catch (err) {
            cb(err);
            return null;
        }

        cb(null, beneficiario.toJSON());
    }

    async guardar(req, cb) {

        const auth = req.auth;
        let body = req.body;

        let transaction, cliente, nBeneficiarios, beneficiario;

        let beneficiarioDatos = {
            nombres: body.nombres,
            email: body.email,
            telefono: body.telefono,
            relacion: body.relacion,
            identificacion: body.identificacion
        }

        try {
            transaction = await sequelize.transaction();

            cliente = await sq.Cliente.findOne({ where: { usuario_id: auth.id } });

            nBeneficiarios = await sq.Beneficiario.count({
                where: { cliente_id: cliente.id }
            });

            if (nBeneficiarios == 3) {
                cb(null, 'BENEFICIARIOS_LIMITE_ALCANZADO');
                return null;
            }

            beneficiarioDatos.cliente_id = cliente.id;

            beneficiario = await sq.Beneficiario.create(beneficiarioDatos, { silent: true, transaction });

            await transaction.commit();

            await beneficiario.reload();
        } catch (err) {
            await transaction.rollback();

            if (err.name == "SequelizeValidationError") err.status = 400;

            cb(err);
            return null;
        }

        cb(null, beneficiario.toJSON());
    }

    async editar(req, cb) {
        
        const auth = req.auth;
        let body = req.body,
            params = req.params;

        let transaction, usuario, beneficiario;

        try {
            usuario = await Usuario.findById( auth.id , { include: [{ model: Cliente, as: '_cliente' }] });

            if (usuario == null) {
                cb(null, 'USUARIO_NO_ENCONTRADO');
                return null;
            }

            beneficiario = await Beneficiario.findOne({
                where: { id: params.id , cliente_id: usuario._cliente.id }
            }, { include: [{ model: Cliente, as: '_cliente' }] });

            if (beneficiario == null) {
                cb(null, 'BENEFICIARIO_NO_ENCONTRADO');
                return null;
            }
        } catch (err) {
            cb(err);
            return null;
        }
        
        let beneficiarioDatos = {
            nombres: body.nombres || beneficiario.nombres,
            email: body.email || beneficiario.email,
            telefono: body.telefono || beneficiario.telefono,
            relacion: body.relacion || beneficiario.relacion,
            identificacion: body.identificacion || beneficiario.identificacion
        }

        try {
            transaction = await sq.sequelize.transaction();

            await beneficiario.update(beneficiarioDatos, { transaction });

            await transaction.commit()

            await beneficiario.reload();
        } catch (err) {
            await transaction.rollback();

            if (err.name == "SequelizeValidationError") err.status = 400;

            cb(err);
            return null;
        }

        cb(null, beneficiario.toJSON());
    }
}

module.exports = new BeneficiarioRepo;