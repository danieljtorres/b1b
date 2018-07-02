'use strict';
module.exports = (sequelize, DataTypes) => {
	var Rendimiento = sequelize.define('Rendimiento', {
		//id: { type: DataTypes.INTEGER, primaryKey: true },
		inversion_id: DataTypes.INTEGER,
		monto: {
			type: DataTypes.DECIMAL(19, 2),
			allowNull: false
		},
		codigo_inversion: {
			type: DataTypes.STRING,
			allowNull: false
		},
		codigo_factura: DataTypes.STRING,
		correlativo: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		underscored: true,
		//paranoid: true,
		tableName: 'rendimientos',
		createdAt: 'creado',
		updatedAt: false,//'actualizado',
		//deletedAt: 'borrado',

	});
	Rendimiento.associate = function (models) {
		Rendimiento.belongsTo(models.Inversion, { foreignKey: 'codigo_inversion', targetKey: 'codigo', as: '_inversion' });
		Rendimiento.belongsTo(models.Factura, { foreignKey: 'codigo_factura', targetKey: 'codigo', as: '_factura' });
	};
	return Rendimiento;
};