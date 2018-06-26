'use strict';

const sq = require('app/Models/sequelize');
const sequelize = sq.sequelize
const Sequelize = sq.Sequelize;
const Op = sq.Sequelize.Op;

class PaisRepo {

    async todos(cb) {
        let paises;

        try {
            paises = await sq.Pais.findAll({
                order:[['nombre','DESC']]
            });
        } catch (error) {
            cb(error);
            return null;
        }

        cb(null, paises);
    }
}

module.exports = new PaisRepo;