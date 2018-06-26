'use strict';
module.exports = (sequelize, DataTypes) => {
  var Usuario = sequelize.define('Usuario', {
    //id: { type: DataTypes.INTEGER, primaryKey: true },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    referencia: DataTypes.INTEGER,
    avatar: {
      type:DataTypes.STRING,
      get() {
        return __httpUrl + '/api/v0/avatares/' + this.getDataValue('avatar');
      }
    },
    codigo: DataTypes.STRING,
    clave_pago: DataTypes.STRING,
    activo: DataTypes.INTEGER
  }, {
    underscored: true,
    paranoid: true,
    tableName: 'usuarios',
    createdAt: 'creado',
    updatedAt: 'actualizado',
    deletedAt: 'borrado',

    indexes: [{
      unique: true, 
      fields: ['usuario','email','identificacion']
    }]
  });
  Usuario.associate = function(models) {
    Usuario.hasOne(models.Cliente, { foreignKey:'usuario_id', as: '_cliente', onDelete: 'cascade', hooks: true } );
    Usuario.hasOne(models.Asociacion, { foreignKey:'usuario_id', as: '_asociacion', onDelete: 'cascade', hooks: true } );
    Usuario.hasMany(models.Inversion, { foreignKey:'usuario_id', as: '_inversiones', onDelete: 'cascade', hooks: true } );
    Usuario.belongsTo(models.Rol, { foreignKey:'rol_id', as: '_rol' } );
  };
  Usuario.beforeCreate((usuario, options) => {
    usuario.password = require('password-hash').generate(usuario.password);
  });
  Usuario.beforeUpdate((usuario, options) => {
    if (options.fields.indexOf('password') != -1) {
      usuario.password = require('password-hash').generate(usuario.password);
    }
  });
  Usuario.beforeDestroy(async (usuario, options) => {
    let transaction = options.transaction;
    await usuario._cliente.destroy({ transaction });
  })
  return Usuario;
};