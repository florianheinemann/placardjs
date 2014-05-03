'use strict';

var config = require('./config');
var express = require('express');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongostore')(express);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models').User;

var app = express();

app.set('port', config.http.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));

app.use(express.bodyParser());
app.use(expressValidator());

app.use(express.methodOverride());

app.use(express.cookieParser(config.http.cookie_secret));
app.use(express.session({	secret: config.http.cookie_secret,
							cookie: {maxAge: 60*60*24*365*10},
						    store: new MongoStore( { db: config.mongodb.database,
						    						host: config.mongodb.host,
						    						port: config.mongodb.port,
						    						username: config.mongodb.user, 
						    						password: config.mongodb.password })}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.verifyUser(username, password, function(error, validated) {
			done(error, validated);
		});
	}
));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

routes.admin(app);
routes.frontend(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
