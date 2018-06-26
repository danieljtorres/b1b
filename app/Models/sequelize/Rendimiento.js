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
		codigo_pago: DataTypes.STRING,
		correlativo: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		solicitado: DataTypes.INTEGER,
		liberado: DataTypes.INTEGER,
		pagado: DataTypes.DATE
	}, {
		underscored: true,
		//paranoid: true,
		tableName: 'rendimientos',
		createdAt: 'creado',
		updatedAt: false,//'actualizado',
		//deletedAt: 'borrado',

		indexes: [{
			unique: true,
			fields: ['codigo']
		}]
	});
	Rendimiento.associate = function (models) {
		Rendimiento.belongsTo(models.Inversion, { foreignKey: 'inversion_id', as: '_inversion' });
	};
	return Rendimiento;
};