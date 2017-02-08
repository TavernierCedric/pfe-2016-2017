/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('profils_logiciels', {
    id_profil: {
      type: DataTypes.INTEGER,
      notNull: true,            // won't allow null
      primaryKey: true,
      references: {
        model: 'profils',
        key: 'id_profil'
      }
    },
    id_logiciel: {
      type: DataTypes.INTEGER,
      notNull: true,            // won't allow null
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
