'use strict';

var moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  var Inversion = sequelize.define('Inversion', {
    //id: { type: DataTypes.INTEGER, primaryKey: true },
    usuario_id: DataTypes.INTEGER,
    plan_id: DataTypes.INTEGER,
    estado_id: DataTypes.INTEGER,
    monto: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false
    },
    voucher: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        return __httpUrl + '/api/v0/vouchers/' + this.getDataValue('voucher');
      }
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    aprobado: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('aprobado')).format('MM/DD/YYYY');
      }
    },
    capitalizar: DataTypes.INTEGER,
    finalizado: DataTypes.DATE
  }, {
    underscored: true,
    paranoid: true,
    tableName: 'inversiones',
    createdAt: 'creado',
    updatedAt: 'actualizado',
    deletedAt: 'borrado',

    indexes: [{
        unique: true, 
        fields: ['codigo']
      }]
  });
  Inversion.associate = function(models) {
    Inversion.belongsTo(models.Usuario, { foreignKey:'usuario_id', as: '_usuario' } );
    Inversion.belongsTo(models.Plan, { foreignKey:'plan_id', as: '_plan' } );
    Inversion.belongsTo(models.Estado, { foreignKey:'estado_id', as: '_estado' } );
    Inversion.hasMany(models.Rendimiento, { foreignKey: 'codigo_inversion', sourceKey: 'codigo', as: '_rendimientos_x_codigo' });
    Inversion.hasMany(models.Rendimiento, { foreignKey: 'inversion_id', as: '_rendimientos' } );
    Inversion.hasMany(models.Factura, { foreignKey:'inversion_id', as: '_facturas' } );
  };
  return Inversion;
};