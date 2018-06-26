'use strict';
module.exports = (sequelize, DataTypes) => {
	var Configuracion = sequelize.define('Configuracion', {
		//id: { type: DataTypes.INTEGER, primaryKey: true },
		nombre: {
			type: DataTypes.STRING,
			allowNull: false
		},
		descripcion: {
			type: DataTypes.TEXT('mediumtext'),
			allowNull: false
		},
		value: {
			type: DataTypes.TEXT('mediumtext'),
			allowNull: false
		},
		activo: DataTypes.INTEGER
	}, {
		underscored: true,
		tableName: 'configuraciones',

		indexes: [{
			unique: true,
			fields: ['nombre']
		}]
	});
	Configuracion.associate = function (models) {
		//Configuracion.hasMany(models.Inversion, { foreignKey: 'estado_id', as: '_inversiones' });
	};
	return Configuracion;
};