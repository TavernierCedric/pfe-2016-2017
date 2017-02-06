var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = {
    matricule : '',
    nom : '',
    prenom : '',
    annee : '',
    orientation : '',
    email : ''
};

function generateHash (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

function validPassword (password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);