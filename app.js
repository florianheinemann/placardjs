'use strict';

var config = require('./config');
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongostore')(express);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models').User;
var middleware = require('./middleware');

var app = express();

app.set('port', config.http.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.cookieParser(config.http.cookie_secret));
app.use(express.session({	secret: config.http.cookie_secret,
							cookie: {maxAge: 60*60*24*365*10},
						    store: new MongoStore( { db: config.mongodb.database,
						    						host: config.mongodb.host,
						    						port: config.mongodb.port,
						    						username: config.mongodb.user, 
						    						password: config.mongodb.password })}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			if(err) {
				return done(err);
			} else if(!user) {
				return done(null, false, { message: 'Incorrect username.' });
			} else if(!user.verifyPassword(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		});
	}
));

passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);




app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index());
app.get('/login', middleware.ensureNotAuthenticated, routes.login());
app.post('/login', middleware.ensureNotAuthenticated, routes.authenticate());
app.get('/logout', middleware.ensureAuthenticated, routes.logout());

app.get('/register', middleware.ensureNotAuthenticated, routes.register());
app.post('/register', middleware.ensureNotAuthenticated, routes.createUser(), routes.authenticate());



// var Post = require('./models').Post;
// var TextPost = require('./models').TextPost;

// var post = new Post({ title: "A new post", permaLink: "post"});
// post.test();
// var textpost = new TextPost( {title: "Another post", markdown: "data", permaLink: "another"} );
// textpost.test();

// //post.save();
// //textpost.save();

// Post.find(function(err, data) {
// 	console.log(data);
// 	for (var i = data.length - 1; i >= 0; i--) {
// 		data[i].test();
// 	};
// });



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
