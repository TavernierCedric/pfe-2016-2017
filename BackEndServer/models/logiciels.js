/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('logiciels', {
    id_logiciel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: "nextval(pk_logiciels::regclass)",
      primaryKey: true
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'logiciels',
    timestamps: false
  });
};
