var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../app/model/user');

// expose this function to our app using module.exports
const passport = require('passport');
const knex = require('../db/connection');
module.exports = () => {

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        knex('users').where({id}).first()
        .then((user) => { done(null, user); })
        .catch((err) => { done(err,null); });
    });

};