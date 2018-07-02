'use strict';
module.exports = (sequelize, DataTypes) => {
	var Factura = sequelize.define('Factura', {
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
		tableName: 'facturas',
		createdAt: 'creado',
		updatedAt: false,//'actualizado',
		//deletedAt: 'borrado',

		indexes: [{
			unique: true,
			fields: ['codigo']
		}]
	});
	Factura.associate = function (models) {
		Factura.belongsTo(models.Inversion, { foreignKey: 'inversion_id', as: '_inversion' });
		Factura.hasMany(models.Rendimiento, { foreignKey: 'codigo_factura', sourceKey: 'codigo', as: '_rendimientos' });
	};
	return Factura;
};