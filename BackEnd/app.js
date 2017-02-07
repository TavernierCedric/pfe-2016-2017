var express = require('express'),
    app = express(),
    port = process.env.PORT || 8080,
    pg = require('pg'),
    passport = require('passport'),
    flash = require('connect-flash'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    path = require('path'),
    fs = require('fs'),
    http = require('http'),
    server = http.createServer(app),
    User = require('./app/model/user')

app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var configDB = require('./config/database.js');
var router = express.Router();
    pg = require('pg');
    connectionString = 'postgres://postgres:272824@localhost:5432/pfe';
    client = new pg.Client(connectionString);
client.connect();

app.use(bodyParser());
app.use(session({ secret: '4a1l23k6rt$$' }));
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); 

//require('./config/passport')(passport);
require('./app/routes.js')(app, passport);

  pg.connect(connectionString, (err, client, done) => {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }else{
        console.log('Successfully connected to local database');
    }
});

server.listen(8080);