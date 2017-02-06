module.exports = function (app, passport,io){

     app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login'
    }));


    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/signup'
    }));
}


function isLogged(req, res, next) {
   if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}