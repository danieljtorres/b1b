'use strict';

const sq        = require('app/Models/sequelize');
const sequelize = sq.sequelize
const Sequelize = sq.Sequelize;
const Op = sq.Sequelize.Op;

class EventoService {

    constructor(){
        this.usuario_id = null;
        this.cuerpo = {
            /*accion: null,
            descripcion: null,
            registros: [],*/
        };
        this.tablas = [];
    }

    setUser(id) {
        this.usuario_id = id;
    }

    addToBody(val) {
        Object.keys(val).forEach((el) => {
            this.cuerpo[val] = val[el];
        });
        return this;
    }

    addToTables(name) {
        this.tablas.push(name);
    }

    async save(trans = null) {
        try {
            await sq.Evento.create({
                usuario_id: this.usuario_id,
                cuerpo: JSON.stringify(this.cuerpo),
                tablas: this.tablas.join(',')
            }, trans ? { trans } : {})

            this.usuario_id = null;
            this.cuerpo = {};
            this.tablas = [];
        } catch (error) {
            throw error
        }
    }
}

module.exports = new EventoService();