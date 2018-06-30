'use strict';

const sq        = require('app/Models/sequelize');
const sequelize = sq.sequelize
const Sequelize = sq.Sequelize;
const Op = sq.Sequelize.Op;

const jwtService   = require('app/Services/JwtService');
const emailService = require('app/Services/EmailService');

const _he          = require('app/Helpers');
const passwordHash = require('password-hash');
const fs           = require('fs');

class UsuarioRepo {

    async login(req, cb) {

        let body  = req.body;

        let loginDatos = {
            usuario: body.usuario,
            password: body.password
        }

        let usuario, token;

        try {
            usuario = await sq.Usuario.findOne({ 
                where: {usuario: loginDatos.usuario}, 
                attributes: ['id', 'usuario', 'password', 'avatar', 'activo', 'rol_id'] 
            });

            if (usuario == null) {
                cb(null, 'LOGIN_INCORRECTO');
                return null;
            }

            if (!usuario.activo) {
                cb(null, 'USUARIO_NO_ACTIVO');
                return null;  
            }

            if ( !passwordHash.verify(loginDatos.password, usuario.password) ) {
                cb(null, 'LOGIN_INCORRECTO');
                return null;
            }

            token = jwtService.crearToken({
                id: usuario.id, 
                rol: usuario.rol_id,
                avatar: usuario.avatar,
            }, usuario.rol_id);
        } catch (err) {
            cb(err);
            return null;
        }

        cb(null, {token: token});
    }

    async datos(req, cb) {

        let auth = req.auth; 
        
        let usuario, nReferidos, nInversiones = {}, totalInvertido, capitalActual, rendimientoGenerado;

        try {
            usuario = await sq.Usuario.findOne({
                where: { id: auth.id },
                include: [{model: sq.Cliente, as: '_cliente'}]
            })

            usuario = usuario.toJSON();

            nReferidos = await sq.Usuario.count({ where: { referencia : usuario.id } });
            usuario._n_referidos = nReferidos;

            nInversiones.total = await sq.Inversion.count({ where: { usuario_id : usuario.id, estado_id: { [Op.ne]: 4 } } });
            nInversiones.solicitudes = await sq.Inversion.count({ where: { usuario_id : usuario.id, estado_id: 1 } });
            nInversiones.activas = await sq.Inversion.count({ where: { usuario_id : usuario.id, estado_id: 2 } });
            nInversiones.finalizadas = await sq.Inversion.count({ where: { usuario_id : usuario.id, estado_id: 3 } });
            usuario._n_inversiones = nInversiones;

            if (usuario == null) {
                cb(null, 'USUARIO_NO_ENCONTRADO');
                return null;
            } 
        } catch (err) {
            cb(err);
            return null;
        }

        cb(null, usuario);
    }

    async todos(cb) {

        let usuarios;

        try {
            usuarios = await sq.Usuario.findAll({ include: [
                    { model: sq.Cliente, as: '_cliente' },
                    { model: sq.Rol, as: '_rol' }
                ] 
            });
        } catch (error) {
            cb(error);
            return null;
        }

        cb(null, usuarios);
    }

    async admins(cb) {
        
        let usuarios;

        try {
            usuarios = await sq.Usuario.findAll({ 
                where: { rol_id: 2 },
                include: [{ model: sq.Cliente, as: '_cliente' }] 
            });
        } catch (error) {
            cb(error);
            return null;
        }

        cb(null, usuarios);
    }

    async clientes(req, cb) {

        let query = req.query;

        let result, clientes, totalClientes, nReferidos, nInversiones = {}, limit, offset;

        limit = parseInt(query.limit) || 10;
        offset = parseInt(query.offset) || 0;

        try {
            result = await sq.Usuario.findAndCountAll({ 
                where: { rol_id: 3 },
                limit: limit,
                offset: offset,
                include: [{ model: sq.Cliente, as: '_cliente' }] 
            });

            clientes = result.rows;
            totalClientes = result.count;

            await _he.asyncForEach(clientes, async (usuario, key) => {

                clientes[key] = clientes[key].toJSON();

                let id = clientes[key].id;

                nReferidos = await sq.Usuario.count({ where: { referencia : id } });
                clientes[key]._n_referidos = nReferidos;

                nInversiones.total = await sq.Inversion.count({ where: { usuario_id : id, estado_id: { [Op.ne]: 4 } } });
                nInversiones.solicitudes = await sq.Inversion.count({ where: { usuario_id : id, estado_id: 1 } });
                nInversiones.activas = await sq.Inversion.count({ where: { usuario_id : id, estado_id: 2 } });
                nInversiones.finalizadas = await sq.Inversion.count({ where: { usuario_id : id, estado_id: 3 } });
                clientes[key]._n_inversiones = nInversiones;
            });

        } catch (error) {
            cb(error);
            return null;
        }

        cb(null, {
            datos : clientes,
            cabeceras: {
                "Total-Rows": totalClientes
            }
        });
    }

    async asociados(cb) {
                
        let usuarios, nReferidos, nInversiones = {};

        try {
            usuarios = await sq.Usuario.findAll({ 
                where: { rol_id: 3 },
                include: [
                    { model: sq.Asociacion, as: '_asociacion', where: { usuario_id: Sequelize.col('Usuario.id') } },
                    { model: sq.Cliente, as: '_cliente' }
                ] 
            });

            await _he.asyncForEach(usuarios, async (usuario, key) => {

                usuario[key] = usuario[key].toJSON();

                let id = usuario[key].id;

                nReferidos = await sq.Usuario.count({ where: { referencia : id } });
                usuario[key]._n_referidos = nReferidos;

                nInversiones.total = await sq.Inversion.count({ where: { usuario_id : id, estado_id: { [Op.ne]: 4 } } });
                nInversiones.solicitudes = await sq.Inversion.count({ where: { usuario_id : id, estado_id: 1 } });
                nInversiones.activas = await sq.Inversion.count({ where: { usuario_id : id, estado_id: 2 } });
                nInversiones.finalizadas = await sq.Inversion.count({ where: { usuario_id : id, estado_id: 3 } });
                usuario[key]._n_inversiones = nInversiones;
            });

        } catch (error) {
            cb(error);
            return null;
        }

        cb(null, usuarios);
    }

    async referidosPorUsuario(req, cb) {

        const auth = req.auth;

        let params = req.params,
            id;
            
        let usuario, usuarios, nReferidos, nInversiones = {}, totalInvertido;

        if (params.id && auth.rol == 3) {
            cb(null, 'PERMISOS_INVALIDOS');
            return null;
        } else if (!params.id && auth.rol != 3) {
            cb(null, 'PARAMETROS_NO_ESPECIFICADOS');
            return null;
        }  else if (!params.id && auth.rol == 3) {
            id = auth.id;
        } else if (params.id && auth.rol != 3) {
            id = params.id;
        }

        try {
            usuario = await sq.Usuario.findOne({ 
                where: { id: id },
                include: [{model: sq.Asociacion, as: '_asociacion'}]
            });

            if (usuario == null) {
                cb(null, 'USUARIO_NO_ENCONTRADO');
                return null;
            }

            if (!usuario._asociacion || usuario._asociacion == null) {
                cb(null, 'ASOCIACION_NO_ENCONTRADA');
                return null;
            }

            usuarios = await sq.Usuario.findAll({ 
                where: { referencia: id },
                include: [{ model: sq.Cliente, as: '_cliente' }]
            });

            await _he.asyncForEach(usuarios, async (usuario, key) => {

                usuario[key] = usuario[key].toJSON();

                let id = usuario[key].id;

                nReferidos = await sq.Usuario.count({ where: { referencia : id } });
                usuario[key]._n_referidos = nReferidos;

                nInversiones.total = await sq.Inversion.count({ where: { usuario_id : id } });
                nInversiones.solicitudes = await sq.Inversion.count({ where: { usuario_id : id, estado_id: 1 } });
                nInversiones.activas = await sq.Inversion.count({ where: { usuario_id : id, estado_id: 2 } });
                nInversiones.finalizadas = await sq.Inversion.count({ where: { usuario_id : id, estado_id: 3 } });
                usuario[key]._n_inversiones = nInversiones;
            });

        } catch (err) {
            cb(err);
            return null;
        }

        cb(null, usuarios);
    }

    async guardar(req, cb) {

        let body  = req.body;

        let transaction, usuario;

        let usuarioDatos = {
            rol_id: 2,
            usuario: body.usuario,
            email: body.email,
            password: body.password,
            codigo: _he.randomStr(16),
            activo: 1,
            avatar: fs.readFileSync(__basePath + '/resources/avatares/default.txt')
        }

        try {
            transaction = await sq.sequelize.transaction();

            usuario = await sq.Usuario.create(usuarioDatos, { 
                include: [{ model: sq.Cliente, as: '_cliente' }], 
                silent: true, 
                transaction
            });

            await transaction.commit()

            await usuario.reload();
        } catch (err) {
            await transaction.rollback();

            if (err.name == "SequelizeValidationError") err.status = 400;

            cb(err);
            return null;
        }

        cb(null, usuario.toJSON());
    }

    async activar(req, cb) {

        let params = req.params;

        let transaction, usuario;

        try {
            transaction = await sq.sequelize.transaction();

            usuario = await sq.Usuario.findOne({ 
                where: { codigo: params.codigo },
                transaction
            })

            if (usuario == null) {
                cb(null, 'USUARIO_NO_ENCONTRADO');
                await transaction.rollback();
                return null;
            }

            await usuario.update({
                codigo: null,
                activo: 1
            }, { silent: true, transaction });

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();

            cb(err);
            return null;
        }

        cb(null, usuario.toJSON());
    }

    async editar(req, cb) {

        const auth = req.auth;
        let body = req.body,
            params = req.params;

        let transaction, usuario, id;
        
        if (params.id && [1,2].indexOf(auth.rol) != -1) {
            id = params.id;
        } else {
            id = auth.id;
        }

        try {
            usuario = await sq.Usuario.findById( id , { include: [{ model: sq.Cliente, as: '_cliente' }] });

            if (usuario == null) {
                cb(null, 'USUARIO_NO_ENCONTRADO');
                return null;
            }

            if (params.id && usuario.rol_id == 1 || params.id && usuario.rol_id == 2 && auth.rol == 2) {
                cb(null, 'PERMISOS_INVALIDOS');
                return null;
            }
        } catch (err) {
            cb(err);
            return null;
        }
        
        let usuarioDatos = {
            usuario: body.usuario || usuario.usuario,
            email: body.email || usuario.email
        }

        try {
            transaction = await sq.sequelize.transaction();

            await usuario.update(usuarioDatos, { transaction });
        } catch (err) {
            await transaction.rollback();

            if (err.name == "SequelizeValidationError") err.status = 400;

            cb(err);
            return null;
        }

        if (usuario._cliente) {
            let clienteDatos = {
                nombres: body.nombres || usuario._cliente.nombres,
                apellidos: body.apellidos || usuario._cliente.apellidos,
                telefono: body.telefono || usuario._cliente.telefono,
                pais_id: body.pais_id || usuario._cliente.pais_id
            }

            try {
                await usuario._cliente.update(clienteDatos, { transaction });

                await transaction.commit()

                await usuario.reload();
            } catch (err) {
                await transaction.rollback();

                if (err.name == "SequelizeValidationError") err.status = 400;
    
                cb(err);
                return null;
            }
        }else{
            await transaction.commit()

            await usuario.reload();
        }

        cb(null, usuario.toJSON());
    }

    async cambiarAvatar(req, cb) {

        const auth = req.auth;
        const avatar = req.files.avatar;

        if (avatar.type.indexOf('image') == -1) {
            cb(null, 'FORMATO_INVALIDO');
            return null;  
        }

        console.log(avatar);

        const nombreAvatar = _he.randomStr(16) + '_' + auth.id + '.' + avatar.type.split('/')[1];
        
        console.log(nombreAvatar)
        
        const temporal     = avatar.path;
        const pathObjetivo = '/resources/avatares/' ;

        let transaction, usuario;

        try {
            transaction = await sequelize.transaction();

            usuario = await sq.Usuario.findById( auth.id, {transaction})

            if (usuario == null) {
                cb(null, 'USUARIO_NO_ENCONTRADO');
                return null;
            }

            await _he.uploadFile(temporal, pathObjetivo, nombreAvatar)

            await usuario.update({avatar: nombreAvatar}, {transaction});

            await transaction.commit()

            await _he.deleteFile(pathObjetivo + usuario.avatar);
        } catch (err) {
            console.log(err)
            await transaction.rollback();

            if (err.name == "SequelizeValidationError") err.status = 400;

            await _he.deleteFile(pathObjetivo + nombreAvatar);

            cb(err);
            return null;
        }

        cb(null, usuario.toJSON());
    }

    async borrar(req, cb) {
        
        let params = req.params;
        
        let transaction, usuario;

        try {
            transaction = await sq.sequelize.transaction();

            usuario = await sq.Usuario.findById( params.id , {
                include:  [{ model: sq.Cliente, as: '_cliente' }],
                transaction
            })

            if (usuario == null) {
                cb(null, 'USUARIO_NO_ENCONTRADO');
                await transaction.rollback();
                return null;
            }

            await usuario.destroy({ silent: true, transaction});

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();

            cb(err);
            return null;
        }

        cb(null, {borrado: true})
    }

}

module.exports = new UsuarioRepo;