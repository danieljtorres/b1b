'use strict';

const sq = require('app/Models/sequelize');
const sequelize = sq.sequelize
const Sequelize = sq.Sequelize;
const Op = sq.Sequelize.Op;

const emailService = require('app/Services/EmailService');

const _he    = require('app/Helpers');
const moment = require('moment')

class RendimientoRepo {

    async generar(cb) {
        
        let transaction, inversiones;

        try {
            inversiones = await sq.Inversion.findAll({
                where: { estado_id: 2 },
                include: [
                    { model: sq.Usuario, as: '_usuario' },
                    { model: sq.Plan, as: '_plan' },
                    { model: sq.Rendimiento, as: '_rendimientos', include: [
                            { model: sq.Factura, as: '_factura'}
                        ] 
                    }
                ]
            });
        } catch (error) {
            cb(error)
        }

        let plan, nRendimientos, monto, montoMensual, montoDiario, fechaActual, fechaAprobado, diffFechas, estado, planNuevo, plan_id;

        try {

            transaction = await sequelize.transaction();

            await _he.asyncForEach(inversiones, async (inversion, key) => {

                plan = inversion._plan;
                nRendimientos = inversion._rendimientos.length;
    
                if (nRendimientos < 1) {
    
                    //Guardo el primer rendimiento 1
                    montoMensual = (inversion.monto * (plan.porcentaje / 100) ) / plan.tiempo;
                    
                    montoDiario = montoMensual / 30
    
                    fechaActual = moment();
                    fechaAprobado = moment(inversion.aprobado, 'YYYY/MM/DD');
                    
                    diffFechas = fechaActual.diff(fechaAprobado, 'days')

                    if (diffFechas >= 5) {

                        monto = montoDiario * diffFechas

                        try {
                            await sq.Rendimiento.create({
                                inversion_id: inversion.id,
                                monto: monto,
                                codigo_inversion: inversion.codigo,
                                correlativo: nRendimientos + 1
                            }, { silent: true, transaction });
            
                        } catch (error) {
                            throw error
                        }

                    }
    
                } else if (nRendimientos > 0 && nRendimientos < plan.tiempo - 2) {
    
                    //Guardo rendimiento y tal vez envio email 1-10
                    montoMensual = (inversion.monto * (plan.porcentaje / 100) ) / plan.tiempo;
    
                    try {
                        await sq.Rendimiento.create({
                            inversion_id: inversion.id,
                            monto: montoMensual,
                            codigo_inversion: inversion.codigo,
                            correlativo: nRendimientos + 1
                        }, { silent: true, transaction });
        
                    } catch (error) {
                        throw error
                    }
    
                } else if (nRendimientos == plan.tiempo - 2) {
    
                    //Guardo rendimiento y envio email 11
                    montoMensual = (inversion.monto * (plan.porcentaje / 100) ) / plan.tiempo;
    
                    try {
                        await sq.Rendimiento.create({
                            inversion_id: inversion.id,
                            monto: montoMensual,
                            codigo_inversion: inversion.codigo,
                            correlativo: nRendimientos + 1
                        }, { silent: true, transaction });
    
                        // Enviar email de penultimo rendimiento de inversion
                        /*emailService.setMssg({
                            to: inversion._usuario.email,
                            subject: 'B1B | Inversion por terminar!',
                        }).setData({
                            usuario: inversion._usuario.usuario
                        }).setHtml('inversion-penultimo-rendimiento');
                        
                        await emailService.send();*/
        
                    } catch (error) {
                        throw error
                    }
    
                } else if (nRendimientos == plan.tiempo - 1) {
    
                    //Guardo rendimiento final, reinvierto o capitalizo los pagos que no se hayan cobrado si el usuario quizo 12
                    //Guardo rendimiento y envio email 11
                    montoMensual = (inversion.monto * (plan.porcentaje / 100) ) / plan.tiempo;
                   
                    let montoReinversion = inversion.monto;
    
                    try {
                        await sq.Rendimiento.create({
                            inversion_id: inversion.id,
                            monto: montoMensual,
                            codigo_inversion: inversion.codigo,
                            correlativo: nRendimientos + 1
                        }, { silent: true, transaction });

                        await inversion.reload()
    
                        inversion._rendimientos.forEach(rendimiento => {
                            if (rendimiento._factura == null || rendimiento._factura.pagado == null) {
                                montoReinversion = montoReinversion + rendimiento.monto;
                            }
                        });
    
                        if (inversion.capitalizar == 2) {
                            estado = 4;
    
                            planNuevo = await sq.Plan.findOne({
                                where: {
                                    [Op.and]: {
                                        tipo: 'INVERSIONES',
                                        min: {
                                            [Op.lt]: montoReinversion,
                                        },
                                        max: {
                                            [Op.gt]: montoReinversion,
                                        }
                                    }
                                },
                                attributes: ['id']
                            });
                
                            if (planNuevo == null) {
                                plan_id = inversion.plan_id;
                            } else {
                                plan_id = planNuevo.id;
                            }
    
                            await sq.Inversion.create({
                                usuario_id: inversion.usuario_id,
                                plan_id: plan_id,
                                estado_id: 2,
                                monto: montoReinversion,
                                voucher: inversion.voucher,
                                codigo: inversion.codigo,
                                aprobado: moment().format('YYYY/MM/DD HH:mm:ss')
                            }, { silent: true, transaction })
                        } else {
                            estado = 3;
                        }
    
                        await inversion.update({
                            estado_id: estado,
                            finalizado: moment().format('YYYY/MM/DD HH:mm:ss')
                        },{ transaction })
    
                        // Enviar email de penultimo rendimiento de inversion
                        /*emailService.setMssg({
                            to: inversion._usuario.email,
                            subject: 'B1B | Inversion terminada!',
                        }).setData({
                            usuario: inversion._usuario.usuario
                        }).setHtml('inversion-finalizada');
                        
                        await emailService.send();*/
        
                    } catch (error) {
                        throw error
                    }
    
                }
    
            })

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            return cb(error);
        }

        return cb(null, {completado: true});
    }
}

module.exports = new RendimientoRepo;