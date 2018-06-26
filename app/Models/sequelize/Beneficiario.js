'use strict';
module.exports = (sequelize, DataTypes) => {
  var Beneficiario = sequelize.define('Beneficiario', {
    //id: { type: DataTypes.INTEGER, primaryKey: true },
    nombres: DataTypes.STRING,
    relacion: DataTypes.STRING,
    identificacion: DataTypes.STRING
  }, {
    underscored: true,
    tableName: 'beneficiarios',
    createdAt: 'creado',
    updatedAt: 'actualizado',

    indexes: [{
      unique: true, 
      fields: ['identificacion']
    }]
  });
  Beneficiario.associate = function(models) {
    Beneficiario.belongsTo(models.Cliente, { foreignKey:'cliente_id', as: '_cliente', hooks: true } );
  };
  return Beneficiario;
};