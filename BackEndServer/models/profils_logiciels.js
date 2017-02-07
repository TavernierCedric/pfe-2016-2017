/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('profils_logiciels', {
    id_profil: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'null',
        key: 'null'
      }
    },
    id_logiciel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'logiciels',
        key: 'id_logiciel'
      }
    }
  }, {
    tableName: 'profils_logiciels',
    timestamps: false
  });
};
