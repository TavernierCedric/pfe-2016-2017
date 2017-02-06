var express = require('express');
    app = express(),
    port = process.env.PORT || 8080,
    pg = require('pg'),
    pgp = require('pg-promise'),
    passport = require('passport'),
    flash = require('connect-flash'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    path = require('path'),
    fs = require('fs'),
    http = require('http'),
    server = http.createServer(app),
    User = require('./app/models/user')

var configDB = require('./config/database.js')

var db = pgp(cn);

app.use(session({ secret: '4a1l23k6rt$$' }));
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); 

require('./config/passport')(passport);
require('./app/routes.js')(app, passport,io);

server.listen(port);
console.log('Listening  to  port ' + port);