'use strict';

const sq = require('app/Models/sequelize');
const sequelize = sq.sequelize
const Sequelize = sq.Sequelize;
const Op = sq.Sequelize.Op;

//const Services = require('app/Services');

const _he = require('app/Helpers');

class PlanRepo {

    async todos(cb) {

        let planes;

        try {
            planes = await sq.Plan.findAll();
        } catch (error) {
            cb(error);
            return null;
        }

        cb(null, planes);
    }

    async inversiones(cb) {

        let planes;

        try {
            planes = await sq.Plan.findAll({
                where: { tipo: 'INVERSIONES' }
            });
        } catch (error) {
            cb(error);
            return null;
        }

        cb(null, planes);
    }

    async asociaciones(cb) {

        let planes;

        try {
            planes = await sq.Plan.findAll({
                where: { tipo: 'ASOCIACIONES' }
            });
        } catch (error) {
            cb(error);
            return null;
        }

        cb(null, planes);
    }

    async guardar(req, cb) {

        let body = req.body;

        let transaction, plan;

        let planDatos = {
            titulo: body.titulo,
            tipo: body.tipo,
            descripcion: body.descripcion,
            caracteristicas: body.caracteristicas,
            porcentaje: body.porcentaje,
            tiempo: body.tiempo,
            min: body.min,
            max: body.max,
            rendimiento: body.rendimiento
        }

        try {
            transaction = await sequelize.transaction();

            plan = await sq.Plan.create(planDatos, { silent: true, transaction });

            await transaction.commit()

            await plan.reload();
        } catch (err) {
            await transaction.rollback();

            if (err.name == "SequelizeValidationError") err.status = 400;

            cb(err);
            return null;
        }

        cb(null, plan.toJSON());
    }

    async borrar(req, cb) {

        let params = req.params;

        let transaction, plan;

        try {
            transaction = await sequelize.transaction();

            plan = await sq.Plan.findById( params.id , transaction);

            if (plan == null) {
                cb(null, 'PLAN_NO_ENCONTRADO');
                await transaction.rollback();
                return null;
            }

            await plan.destroy({ silent: true, transaction});

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();

            cb(err);
            return null;
        }

        cb(null, {borrado: true})
    }
}

module.exports = new PlanRepo;