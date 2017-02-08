/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('profils', {
    id_profil: {
      type: DataTypes.INTEGER,
      notNull: true,            // won't allow null
      primaryKey: true,
      autoIncrement: true 
    },
    nom: {
      type: DataTypes.STRING,
      notNull: true,            // won't allow null
    }
  }, {
    tableName: 'profils',
    timestamps: false
  });
};
