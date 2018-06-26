'use strict';
module.exports = (sequelize, DataTypes) => {
  var Pais = sequelize.define('Pais', {
    //id: { type: DataTypes.INTEGER, primaryKey: true },
    nombre: DataTypes.STRING,
    iso: DataTypes.STRING
  }, {
    underscored: true,
    tableName: 'paises',
    createdAt: 'creado',
    updatedAt: 'actualizado',

    indexes: [{
      unique: true, 
      fields: ['iso','nombre']
    }]
  });
  Pais.associate = function(models) {
    Pais.hasMany(models.Cliente, { foreignKey:'pais_id', as: '_clientes', onDelete: 'set null', hooks: true } );
  };
  return Pais;
};