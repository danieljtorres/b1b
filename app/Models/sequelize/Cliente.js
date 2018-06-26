'use strict';
module.exports = (sequelize, DataTypes) => {
  var Cliente = sequelize.define('Cliente', {
    //id: { type: DataTypes.INTEGER, primaryKey: true },
    usuario_id: DataTypes.INTEGER,
    pais_id: DataTypes.INTEGER,
    nombres: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefono: DataTypes.STRING,
    identificacion: DataTypes.STRING,
    documento: DataTypes.STRING,
    direccion: DataTypes.STRING,
    ciudad: DataTypes.STRING,
  }, {
    underscored: true,
    paranoid: true,
    tableName: 'clientes',
    createdAt: 'creado',
    updatedAt: 'actualizado',
    deletedAt: 'borrado',

    indexes: [{
        unique: true, 
        fields: ['usuario_id']
      }]
  });
  Cliente.associate = function(models) {
    Cliente.belongsTo(models.Usuario, { foreignKey:'usuario_id', as: '_usuario' } );
    Cliente.belongsTo(models.Pais, { foreignKey:'pais_id', as: '_pais' } );
    Cliente.hasMany(models.Beneficiario, { foreignKey:'cliente_id', as: '_beneficiarios' } );
  };
  return Cliente;
};