'use strict';
module.exports = (sequelize, DataTypes) => {
  var Rol = sequelize.define('Rol', {
    //id: { type: DataTypes.INTEGER, primaryKey: true },
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
  }, {
    underscored: true,
    tableName: 'roles',
    createdAt: 'creado',
    updatedAt: 'actualizado'
  });
  Rol.associate = function(models) {
    Rol.hasMany(models.Usuario, { foreignKey:'rol_id', as: '_usuarios', onDelete: 'cascade', hooks: true } );
  };
  return Rol;
};