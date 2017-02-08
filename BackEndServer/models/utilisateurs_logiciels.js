/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('utilisateurs_logiciels', {
    id_utilisateur: {
      type: DataTypes.INTEGER,
      notNull: true,            // won't allow null
      primaryKey: true,
      references: {
        model: 'utilisateurs',
        key: 'id_utilisateur'
      }
    },
    id_logiciel: {
      type: DataTypes.INTEGER,
      notNull: true,            // won't allow null
      references: {
        model: 'logiciels',
        key: 'id_logiciel'
      }
    },
    mdp: {
      type: DataTypes.STRING,
      notNull: true,            // won't allow null
    }
  }, {
    tableName: 'utilisateurs_logiciels',
    timestamps: false,
    instanceMethods: {
        generateHash: function(password) {
            return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
        },
        validPassword: function(password) {
            return bcrypt.compareSync(password, this.password);
        },
    }
  });
};
