'use strict';
module.exports = (sequelize, DataTypes) => {
	var Pago = sequelize.define('Pago', {
		//id: { type: DataTypes.INTEGER, primaryKey: true },
		inversion_id: DataTypes.INTEGER,
		codigo: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		underscored: true,
		//paranoid: true,
		tableName: 'pagos',
		createdAt: 'creado',
		updatedAt: false,//'actualizado',
		//deletedAt: 'borrado',

		indexes: [{
			unique: true,
			fields: ['codigo']
		}]
	});
	Pago.associate = function (models) {
		Pago.belongsTo(models.Inversion, { foreignKey: 'inversion_id', as: '_inversion' });
		Pago.hasMany(models.Rendimiento, { foreignKey: 'codigo_pago', targetKey: 'codigo', as: '_rendimientos' });
	};
	return Pago;
};