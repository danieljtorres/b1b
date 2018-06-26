'use strict';
module.exports = (sequelize, DataTypes) => {
  var Plan = sequelize.define('Plan', {
    //id: { type: DataTypes.INTEGER, primaryKey: true },
    titulo: {
			type: DataTypes.STRING,
			allowNull: false
		},
    tipo: DataTypes.ENUM('INVERSIONES', 'ASOCIACIONES'),
    descripcion: DataTypes.STRING,
    caracteristicas: DataTypes.TEXT('mediumtext'),
    porcentaje: {
			type: DataTypes.DECIMAL(10, 1),
			allowNull: false
		},
    tiempo: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
    min: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false
		},
    max: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false
		}
  }, {
    underscored: true,
    paranoid: true,
    tableName: 'planes',
    createdAt: 'creado',
    updatedAt: 'actualizado',
    deletedAt: 'borrado',

    indexes: [{
      unique: true, 
      fields: ['titulo']
    }]
  });
  Plan.associate = function(models) {
    Plan.hasMany(models.Inversion, { foreignKey:'plan_id', as: '_inversiones', hooks: true } );
    Plan.hasMany(models.Asociacion, { foreignKey:'plan_id', as: '_asociaciones', hooks: true } );
  };
  Plan.beforeCreate((plan, options) => {
    plan.caracteristicas = JSON.stringify(plan.caracteristicas);
  });
  return Plan;
};