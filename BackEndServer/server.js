var express = require('express'),
    path = require('path'),
    port = process.env.PORT || 8080,
    logger = require('morgan'),
    jwt    = require('jsonwebtoken'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    http = require('http'),
    server = http.createServer(app)

var routes = require('./routes/routes.js');

var app = express();

app.set('superSecret', 'ilovepfe');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));

app.use('/', routes);

app.listen(port);
console.log("Server listening on port : " + port); 

module.export = app;
