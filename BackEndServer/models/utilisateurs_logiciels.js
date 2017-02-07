/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('utilisateurs_logiciels', {
    id_utilisateur: {
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
    },
    mdp: {
      type: DataTypes.STRING,
      allowNull: false
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
