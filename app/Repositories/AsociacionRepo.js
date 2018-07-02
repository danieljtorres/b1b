'use strict';

const sq = require('app/Models/sequelize');
const sequelize = sq.sequelize
const Sequelize = sq.Sequelize;
const Op = sq.Sequelize.Op;

const emailService = require('app/Services/EmailService');
const eventoService = require('app/Services/EventoService');

const _he    = require('app/Helpers');
const moment = require('moment');

class AsociacionRepo {

    async solicitudes(cb) {

        let asociaciones;

        try {
            asociaciones = await sq.Asociacion.findAll({
                where: { aprobado: null },
                include: [{model: sq.Usuario, as: '_usuario', where: { id: Sequelize.col('Asociacion.usuario_id') } }, {model: sq.Plan, as: '_plan'}],
                order: [['id', 'DESC']]
            });
        } catch (error) {
            cb(error);
            return null;
        }

        cb(null, asociaciones);
    }

    async guardar(req, cb) {

        const auth = req.auth;

        let transaction, asociacionAnt, planMenor, asociacion, usuario, admins;

        let asociacionDatos = {
            usuario_id: auth.id
        }

        try {

            asociacionAnt = await sq.Asociacion.findAll({
                where: { usuario_id: auth.id }
            })

            if (asociacionAnt.length) {
                cb(null, 'SOLICITUD_ASOCIACION_REALIZADA');
                return null;
            }

            planMenor = await sq.Plan.findOne({
                where: { tipo: 'ASOCIACIONES' },
                attributes: ['id', [sequelize.fn('MIN', sequelize.col('min')), 'min'], [sequelize.fn('MIN', sequelize.col('max')), 'max']]
            });

            if (planMenor.id == null) {
                cb(null, 'PLAN_NO_ENCONTRADO');
                return null;
            }

            asociacionDatos.plan_id = planMenor.id;
        } catch (err) {
            cb(err, null);
            return null;
        }

        try {
            transaction = await sequelize.transaction();

            asociacion = await sq.Asociacion.create(asociacionDatos, { silent: true, transaction });

            // Enviar email de solicitus realizada a usuario
            usuario = await sq.Usuario.findById( auth.id );

            emailService.setMssg({
                to: usuario.email,
                subject: 'B1B | Nueva solicitud de asociación!',
            }).setData({
                usuario: usuario.usuario
            }).setHtml('solicitud-asociacion-cliente');

            await emailService.send();

            // Enviar email de solicitud de asociacion a admins
            admins = await sq.Usuario.findAll({ where: { [Op.or]: [{rol_id: 1}, {rol_id: 2}] } })

            let adminsEmails = []
            admins.forEach(el => { adminsEmails.push(el.email) });

            emailService.setMssg({
                to: adminsEmails,
                subject: 'B1B | Nueva solicitud de asociación!',
            }).setData({
                usuario: usuario.usuario
            }).setHtml('solicitud-asociacion-admin');
            
            await emailService.send();

            await transaction.commit()

            await asociacion.reload();
        } catch (err) {
            await transaction.rollback();

            if (err.name == "SequelizeValidationError") err.status = 400;

            cb(err);
            return null;
        }

        cb(null, asociacion.toJSON());
    }

    async aprobar(req, cb) {

        let params = req.params;
        
        let transaction, asociacion;

        try {
            asociacion = await sq.Asociacion.findOne({ 
                where: { id: params.id },
                include: { model: sq.Usuario, as: '_usuario'}
            })

            if (asociacion == null) {
                cb(null, 'ASOCIACION_NO_ENCONTRADA');
                return null;
            }

            transaction = await sequelize.transaction();

            await asociacion.update({
                aprobado: moment().format("YYYY-MM-DD HH:mm:ss")
            }, { silent: true , transaction });

            await asociacion._usuario.update({referencia: null}, {silent:true, transaction});

            // Registro de actividad de administrador
            eventoService.setUser(req.auth.id).addToBody({
                accion: 'MODIFICAR',
                descripcion: '${inicio} aceptado la solicitud de asociacion ${final}',
                tablas: [{asociaciones: asociacion.id}]
            }).addToTables('asociaciones');
            await eventoService.save(transaction);

            // Enviar email de solicitud aprobada a usuario
            emailService.setMssg({
                to: asociacion._usuario.email,
                subject: 'B1B | Asociacion Aprobada!',
            }).setData({
                usuario: asociacion._usuario.usuario
            }).setHtml('asociacion-aprobada');
            
            await emailService.send();

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();

            cb(err);
            
            return null;
        }

        cb(null, asociacion.toJSON());
    }
}

module.exports = new AsociacionRepo;