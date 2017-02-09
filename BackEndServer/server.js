var express = require('express'),
    path = require('path'),
    port = process.env.PORT || 8080,
    logger = require('morgan'),
    jwt    = require('jsonwebtoken'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    http = require('http'),
    server = http.createServer(app),
    allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-access-token');
         if ('OPTIONS' == req.method) {
            res.send(200);
        }
        else {
            next();
        }
    };

var routes = require('./routes/routes.js');

var app = express();
app.use(allowCrossDomain);
app.set('superSecret', 'ilovepfe');
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));

app.use('/', routes);

app.listen(port);
console.log("Server listening on port : " + port); 

module.export = app;

