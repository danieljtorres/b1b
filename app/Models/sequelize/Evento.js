'use strict';
module.exports = (sequelize, DataTypes) => {
	var Evento = sequelize.define('Evento', {
		//id: { type: DataTypes.INTEGER, primaryKey: true },
        usuario_id: DataTypes.INTEGER,
        cuerpo: {
            type:DataTypes.STRING,
            get() {
                return JSON.parse(this.getDataValue('cuerpo'));
            }
        },
        tablas: {
            type:DataTypes.STRING,
            get() {
                return this.getDataValue('tablas').split(',');
            }
        }
	}, {
		underscored: true,
		tableName: 'eventos',
	});
	Evento.associate = function (models) {
		Evento.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: '_usuario' });
	};
	return Evento;
};