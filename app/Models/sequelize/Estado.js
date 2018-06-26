'use strict';
module.exports = (sequelize, DataTypes) => {
	var Estado = sequelize.define('Estado', {
		//id: { type: DataTypes.INTEGER, primaryKey: true },
		nombre: DataTypes.STRING
	}, {
		timestamps: false,
		underscored: true,
		tableName: 'estados',

		indexes: [{
			unique: true,
			fields: ['nombre']
		}]
	});
	Estado.associate = function (models) {
		Estado.hasMany(models.Inversion, { foreignKey: 'estado_id', as: '_inversiones' });
	};
	return Estado;
};