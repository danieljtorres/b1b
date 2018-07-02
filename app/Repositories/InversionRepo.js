'use strict';

const sq = require('app/Models/sequelize');
const sequelize = sq.sequelize
const Sequelize = sq.Sequelize;
const Op = sq.Sequelize.Op;

const emailService = require('app/Services/EmailService');
const eventoService = require('app/Services/EventoService');

const _he = require('app/Helpers');

class InversionRepo {

    async solicitudes(req, cb) {

        let query = req.query;

        let result, inversiones, totalRows, limit, offset;

        limit = parseInt(query.limit) || 10;
        offset = parseInt(query.offset) || 0;

        try {
            result = await sq.Inversion.findAll({
                where: { estado_id: 1 },
                limit: limit,
                offset: offset,
                include: [
                    { model: sq.Plan, as: '_plan' },
                    { model: sq.Estado, as: '_estado' }
                ],
                order: [['id', 'DESC']]
            });

            inversiones = result.rows;
            totalRows = result.count;

        } catch (error) {
            cb(error);
            return null;
        }

        cb(null, {
            datos : inversiones,
            cabeceras: {
                "Total-Rows": totalRows
            }
        });
    }

    async todosPorUsuario(req, cb) {

        const auth = req.auth;

        let query = req.query, params = req.params;

        let result, usuario, inversiones, totalRows, id, includeEstado, limit, offset;

        limit = parseInt(query.limit) || 10;
        offset = parseInt(query.offset) || 0;
        
        if (params.id && [1,2].indexOf(auth.rol) != -1) {
            id = params.id;
        } else {
            id = auth.id;
        }

        if (params.estado) {
            includeEstado = { model: sq.Estado, as: '_estado', where: { nombre: params.estado.toUpperCase() } };
        } else {
            includeEstado = { model: sq.Estado, as: '_estado', where: { nombre: 'ACTIVO' } };
        }

        try {
            usuario = await sq.Usuario.findOne({ where: { id: id } });
 
            if (usuario == null) {
                cb(null, 'USUARIO_NO_ENCONTRADO');
                return null;
            }

            result = await sq.Inversion.findAndCountAll({ 
                where: { usuario_id: usuario.id },
                limit: limit,
                offset: offset,
                include: [
                    { model: sq.Plan, as: '_plan' },
                    includeEstado,
                ],
                order: [['id', 'DESC']]
            });

            inversiones = result.rows;
            totalRows = result.count;

            await _he.asyncForEach(inversiones, async (inversion, key) => {
                let porCobrar = await sq.Rendimiento.sum('rendimiento.monto', { 
                    where: { 
                        inversion_id: inversion.id,
                        [Op.or]: {
                            '$_factura.pagado$': null
                        }
                    },
                    include: [
                        { model: sq.Factura, as: '_factura' }
                    ]
                });

                let porPagar = await sq.Rendimiento.sum('rendimiento.monto', { 
                    where: { 
                        inversion_id: inversion.id
                    },
                    include: [
                        { model: sq.Factura, as: '_factura', where: { pagado: null } }
                    ]
                });

                inversiones[key] = inversiones[key].toJSON();
                inversiones[key]._por_cobrar = porCobrar || 0;
                inversiones[key]._pago_solicitado = porPagar || 0;
            });
        } catch (error) {
            console.log(error)

            cb(error);
            return null;
        }

        cb(null,  {
            datos : inversiones,
            cabeceras: {
                "Total-Rows": totalRows
            }
        });
    }

    async historial(req, cb) {
        
        const auth = req.auth;
        let params = req.params;

        let where, inversion;

        try {

            if (auth.rol == 3) {
                where = { id: params.id, usuario_id: auth.id }
            } else {
                where = { id: params.id }
            }

            inversion = await sq.Inversion.findOne({
                where: where,
                include: [
                    { model: sq.Plan, as: '_plan' },
                    { model: sq.Factura, as: '_facturas' },
                    { model: sq.Estado, as: '_estado' },
                    { model: sq.Rendimiento, as: '_rendimientos_x_codigo', include: [
                            { model: sq.Factura, as: '_factura' }
                        ] 
                    }
                ],
                order: [[{ model: sq.Rendimiento, as: '_rendimientos_x_codigo' }, 'id', 'DESC']]
            });

            if (inversion == null) {
                cb(null, 'INVERSION_NO_ENCONTRADO');
                return null;
            }

            let porCobrar = await sq.Rendimiento.sum('rendimiento.monto', { 
                where: { 
                    inversion_id: inversion.id,
                    [Op.or]: {
                        '$_factura.pagado$': null
                    }
                },
                include: [
                    { model: sq.Factura, as: '_factura' }
                ]
            });

            let porPagar = await sq.Rendimiento.sum('rendimiento.monto', { 
                where: { 
                    inversion_id: inversion.id
                },
                include: [
                    { model: sq.Factura, as: '_factura', where: { pagado: null } }
                ]
            });

            inversion = inversion.toJSON();
            inversion._por_cobrar = porCobrar || 0;
            inversion._pago_solicitado = porPagar || 0;

        } catch (error) {
            console.log(error)
            cb(error);
            return null;
        }

        cb(null, inversion);
    }

    async guardar(req, cb) {

        console.log(req.files)

        const auth = req.auth;
        let body = req.body,
            files = req.files;

        let transaction, inversion, usuario;

        if (!files.voucher) {
            cb(null, 'ARCHIVO_OBLIGATORIO');
            return null; 
        }

        if (files.voucher.type.indexOf('image') == -1) {
            cb(null, 'FORMATO_INVALIDO');
            return null;  
        }

        const nombreVoucher = _he.randomStr(16) + '.' + files.voucher.type.split('/')[1];
        const temporal      = files.voucher.path;
        const pathObjetivo  = '/resources/vouchers/';

        let codigo = await generarCodigo(auth.id);

        if ( codigo == false ) {
            cb(null, 'DEFAULT');
            return null;  
        }

        let inversionDatos = {
            usuario_id: auth.id,
            plan_id: body.plan_id,
            estado_id: 1,
            monto: body.monto,
            voucher: nombreVoucher,
            codigo: codigo
        }

        try {
            transaction = await sequelize.transaction();

            await _he.uploadFile(temporal, pathObjetivo, nombreVoucher)

            inversion = await sq.Inversion.create(inversionDatos, { silent: true, transaction });

            // Enviar email de inversion realizada a usuario
            usuario = await sq.Usuario.findById( auth.id );

            emailService.setMssg({
                to: usuario.email,
                subject: 'B1B | Inversion Realizada!',
            }).setData({
                usuario: usuario.usuario
            }).setHtml('inversion-detalle');
            
            await emailService.send();

            await transaction.commit()

            await inversion.reload();
        } catch (err) {
            await transaction.rollback();

            if (err.name == "SequelizeValidationError") err.status = 400;

            await _he.deleteFile(pathObjetivo + nombreVoucher);

            cb(err);
            return null;
        }

        cb(null, inversion.toJSON());
    }

    async aprobar(req, cb) {

        let params = req.params;
        
        let transaction, inversion;

        try {
            inversion = await sq.Inversion.findOne({ 
                where: { id: params.id },
                include: { model: sq.Usuario, as: '_usuario'}
            })

            if (inversion == null) {
                cb(null, 'INVERSION_NO_ENCONTRADA');
                return null;
            }

            transaction = await sequelize.transaction();

            await inversion.update({
                aprobado: moment().format("YYYY-MM-DD HH:mm:ss"),
                estado_id: 2
            }, { silent: true , transaction });

            // Registro de actividad de administrador
            eventoService.setUser(req.auth.id).addToBody({
                accion: 'MODIFICAR',
                descripcion: '${inicio} aprobado la solicitud de inversion ${final}',
                tablas: [{inversiones: inversion.id}]
            }).addToTables('inversiones');
            await eventoService.save(transaction);

            // Enviar email de inversion aprobada a usuario
            emailService.setMssg({
                to: inversion._usuario.email,
                subject: 'B1B | Asociacion Aprobada!',
            }).setData({
                usuario: inversion._usuario.usuario
            }).setHtml('inversion-aprobada');
            
            await emailService.send();

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();

            cb(err);
            return null;
        }

        cb(null, inversion.toJSON());
    }

    async cobrar(req, cb) {

        const auth = req.auth;
        let body = req.body,
            params = req.params;
        
        let transaction, inversion, rendimientos, whereRendimiento, montoFactura = 0, factura;

        let codigo = await generarCodigo(auth.id);

        if ( codigo == false ) {
            cb(null, 'DEFAULT');
            return null;  
        }

        let facturaDatos = {
            codigo: codigo
        }

        try {
            inversion = await sq.Inversion.findOne({
                where: { id: params.id, usuario_id: auth.id, estado_id: 2 }
            })

            if (inversion == null) {
                cb(null, 'INVERSION_NO_ENCONTRADO');
                return null;
            }

            facturaDatos.inversion_id = inversion.id

            whereRendimiento = {
                codigo_factura: null,
                inversion_id: inversion.id
            };

            if (body.correlativo) {
                whereRendimiento.correlativo = { [Op.lte]: body.correlativo }
            }

            rendimientos = await sq.Rendimiento.findAll({
                where: whereRendimiento
            });

            if (!rendimientos.length) {
                cb(null, null);
                return null;
            }

            transaction = await sequelize.transaction();

            await _he.asyncForEach(rendimientos, async (rendimiento, key) => {
                montoFactura = parseFloat(montoFactura) + parseFloat(rendimiento.monto);

                try {
                    await rendimiento.update({ codigo_factura: codigo },{ transaction });
                } catch (error) {
                    throw error;
                }
            });

            facturaDatos.monto = montoFactura;

            factura = await sq.Factura.create(facturaDatos, { silent: true, transaction });

            await transaction.commit();

            await factura.reload();
        } catch (error) {
            console.log(error)
            await transaction.rollback();

            cb(err);
            return null;
        }

        cb(null, factura.toJSON());
    }

}

const generarCodigo = async (id) => {
    let codigo = _he.randomStr(10) + '_' + id, query;
    try {
        query = await sq.Inversion.findAndCountAll({ where: { codigo: codigo } });
        console.log(query);
        if (query.count) generarCodigo(id);
        return codigo;
    } catch (error) { return false; }
}

module.exports = new InversionRepo;



"Executing (default): SELECT `Inversion`.`id`, `Inversion`.`usuario_id`, `Inversion`.`plan_id`, `Inversion`.`estado_id`, `Inversion`.`monto`, `Inversion`.`voucher`, `Inversion`.`codigo`, `Inversion`.`aprobado`, `Inversion`.`capitalizar`, `Inversion`.`finalizado`, `Inversion`.`creado`, `Inversion`.`actualizado`, `Inversion`.`borrado`, `_plan`.`id` AS `_plan.id`, `_plan`.`titulo` AS `_plan.titulo`, `_plan`.`tipo` AS `_plan.tipo`, `_plan`.`descripcion` AS `_plan.descripcion`, `_plan`.`caracteristicas` AS `_plan.caracteristicas`, `_plan`.`porcentaje` AS `_plan.porcentaje`, `_plan`.`tiempo` AS `_plan.tiempo`, `_plan`.`min` AS `_plan.min`, `_plan`.`max` AS `_plan.max`, `_plan`.`creado` AS `_plan.creado`, `_plan`.`actualizado` AS `_plan.actualizado`, `_plan`.`borrado` AS `_plan.borrado`, `_facturas`.`id` AS `_facturas.id`, `_facturas`.`inversion_id` AS `_facturas.inversion_id`, `_facturas`.`monto` AS `_facturas.monto`, `_facturas`.`codigo` AS `_facturas.codigo`, `_facturas`.`numero_transaccion` AS `_facturas.numero_transaccion`, `_facturas`.`pagado` AS `_facturas.pagado`, `_facturas`.`creado` AS `_facturas.creado`, `_estado`.`id` AS `_estado.id`, `_estado`.`nombre` AS `_estado.nombre`, `_rendimientos_x_codigo`.`id` AS `_rendimientos_x_codigo.id`, `_rendimientos_x_codigo`.`inversion_id` AS `_rendimientos_x_codigo.inversion_id`, `_rendimientos_x_codigo`.`monto` AS `_rendimientos_x_codigo.monto`, `_rendimientos_x_codigo`.`codigo_inversion` AS `_rendimientos_x_codigo.codigo_inversion`, `_rendimientos_x_codigo`.`codigo_factura` AS `_rendimientos_x_codigo.codigo_factura`, `_rendimientos_x_codigo`.`correlativo` AS `_rendimientos_x_codigo.correlativo`, `_rendimientos_x_codigo`.`creado` AS `_rendimientos_x_codigo.creado`, `_rendimientos_x_codigo->_factura`.`id` AS `_rendimientos_x_codigo._factura.id`, `_rendimientos_x_codigo->_factura`.`inversion_id` AS `_rendimientos_x_codigo._factura.inversion_id`, `_rendimientos_x_codigo->_factura`.`monto` AS `_rendimientos_x_codigo._factura.monto`, `_rendimientos_x_codigo->_factura`.`codigo` AS `_rendimientos_x_codigo._factura.codigo`, `_rendimientos_x_codigo->_factura`.`numero_transaccion` AS `_rendimientos_x_codigo._factura.numero_transaccion`, `_rendimientos_x_codigo->_factura`.`pagado` AS `_rendimientos_x_codigo._factura.pagado`, `_rendimientos_x_codigo->_factura`.`creado` AS `_rendimientos_x_codigo._factura.creado` FROM `inversiones` AS `Inversion` LEFT OUTER JOIN `planes` AS `_plan` ON `Inversion`.`plan_id` = `_plan`.`id` AND (`_plan`.`borrado` > '2018-07-02 22:38:54' OR `_plan`.`borrado` IS NULL) LEFT OUTER JOIN `facturas` AS `_facturas` ON `Inversion`.`id` = `_facturas`.`inversion_id` LEFT OUTER JOIN `estados` AS `_estado` ON `Inversion`.`estado_id` = `_estado`.`id` LEFT OUTER JOIN `rendimientos` AS `_rendimientos_x_codigo` ON `Inversion`.`id` = `_rendimientos_x_codigo`.`codigo_inversion` LEFT OUTER JOIN `facturas` AS `_rendimientos_x_codigo->_factura` ON `_rendimientos_x_codigo`.`codigo_factura` = `_rendimientos_x_codigo->_factura`.`codigo` WHERE ((`Inversion`.`borrado` > '2018-07-02 22:38:54' OR `Inversion`.`borrado` IS NULL) AND (`Inversion`.`id` = '15' AND `Inversion`.`usuario_id` = 51))"