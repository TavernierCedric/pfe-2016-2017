/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('logiciels', {
    id_logiciel: {
      type: DataTypes.INTEGER,
      notNull: true,            // won't allow null
      defaultValue: "nextval(pk_logiciels::regclass)",
      primaryKey: true
    },
    nom: {
      type: DataTypes.STRING,
      notNull: true,            // won't allow null
    }
  }, {
    tableName: 'logiciels',
    timestamps: false
  });
};
