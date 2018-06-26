'use strict';
module.exports = (sequelize, DataTypes) => {
	var Asociacion = sequelize.define('Asociacion', {
		//id: { type: DataTypes.INTEGER, primaryKey: true },
		plan_id: DataTypes.INTEGER,
		usuario_id: DataTypes.INTEGER,
		aprobado: DataTypes.DATE,
		inicio: DataTypes.DATE,
	}, {
		underscored: true,
		paranoid: true,
		tableName: 'asociaciones',
		createdAt: 'creado',
		updatedAt: 'actualizado',
		deletedAt: 'borrado',

		indexes: [{
			unique: true,
			fields: ['usuario_id']
		}]
	});
	Asociacion.associate = function (models) {
		Asociacion.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: '_usuario' });
		Asociacion.belongsTo(models.Plan, { foreignKey: 'plan_id', as: '_plan' });
	};
	return Asociacion;
};