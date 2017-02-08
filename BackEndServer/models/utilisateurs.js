/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('utilisateurs', {
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    matricule: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_profil: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'profils',
        key: 'id_profil'
      }
    }
  }, {
    tableName: 'utilisateurs',
    timestamps: false
  });
};
