'use strict'

const Errors = {
   'USUARIO_NO_ENCONTRADO': { status: 404, msg: 'Usuario no encontrado en la base de datos' },

   'PLAN_NO_ENCONTRADO': { status: 404, msg: 'Plan no encontrado en la base de datos' },

   'BENEFICIARIO_NO_ENCONTRADO': { status: 404, msg: 'Beneficiario no encontrado en la base de datos' },

   'BENEFICIARIOS_LIMITE_ALCANZADO': { status: 409, msg: 'Conflicto, limite de beneficiarios' },

   'ASOCIACION_NO_ENCONTRADA': { status: 404, msg: 'Asociacion no encontrada en la base de datos' },

   'SOLICITUD_ASOCIACION_REALIZADA': { status: 409, msg: 'Conflicto, solicitud de asociacion ya realizada' },

   'LOGIN_INCORRECTO': { status: 404 , msg: 'Combinacion de usuario, contraseña es incorrecta' },

   'USUARIO_NO_ACTIVO': { status: 403, msg: 'Usuario no se encuentra activo' },

   'PERMISOS_INVALIDOS': { status: 401, msg: 'Usuario no tiene el rol para realizar esta accion'},

   'FORMATO_INVALIDO': { status: 422, msg: 'Formato invalido' },

   'ARCHIVO_OBLIGATORIO' : { status: 422, msg: 'El archivo es obligatorio en la peticion' },

   'DEFAULT': { status: 500, msg: 'Ha ocurrido un error' }
};

module.exports = {
    check: (datos) => {
        if (typeof datos == 'string') {
            return true;
        }
    },


    get: (datos) => {
        if (Errors[datos]) {
            return Errors[datos];
        } else {
            console.log('Error no encontrado: ' + datos)
            return Errors['DEFAULT']; 
        }
    }
}