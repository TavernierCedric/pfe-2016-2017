/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('profils', {
    id_profil: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: "nextval(pk_profils::regclass)",
      primaryKey: true
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'profils',
    timestamps: false
  });
};
