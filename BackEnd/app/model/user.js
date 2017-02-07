var bcrypt   = require('bcrypt-nodejs'),
    userSchema = {
        matricule : '',
        nom : '',
        prenom : '',
        annee : '',
        orientation : '',
        email : ''
    }

// define the export module for our user
module.exports = {

    generateHash : function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },

    validPassword : function(password) {
        return bcrypt.compareSync(password, this.local.password);
    }

}