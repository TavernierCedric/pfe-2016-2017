/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('utilisateurs', {
    id_utilisateur: {
      type: DataTypes.INTEGER,
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    matricule: {
      type: DataTypes.INTEGER,
      allowNull: true,
      isNumeric: true,          // will only allow numbers

    },
    nom: {
      type: DataTypes.STRING,
      notNull: true,
      isAlphanumeric: true, 
    },
    prenom: {
      type: DataTypes.STRING,
      notNull: true,
      isAlphanumeric: true, 
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: true,
      isEmail: true,
    },
    type: {
      type: DataTypes.STRING,
      notNull: true,
    },
    login: {
      type: DataTypes.STRING,
      notNull: true,
      isAlphanumeric: true, 
      len: [2,7]
    },
    id_profil: {
      type: DataTypes.INTEGER,
      notNull: true,
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
