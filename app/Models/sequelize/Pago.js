'use strict';
module.exports = (sequelize, DataTypes) => {
	var Pago = sequelize.define('Pago', {
		//id: { type: DataTypes.INTEGER, primaryKey: true },
		inversion_id: DataTypes.INTEGER,
		monto: {
			type: DataTypes.DECIMAL(19, 2),
			allowNull: false
		},
		codigo: {
			type: DataTypes.STRING,
			allowNull: false
		},
		numero_transaccion: DataTypes.STRING,
		pagado: DataTypes.DATE
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
		Pago.hasMany(models.Rendimiento, { foreignKey: 'codigo_factura', targetKey: 'codigo', as: '_rendimientos' });
	};
	return Pago;
};