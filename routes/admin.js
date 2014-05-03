'use strict';

var middleware = require('../middleware');
var admin = require('../controllers').admin;

var routes = function(app) {
	app.get('/author/login', middleware.ensureNotAuthenticated, admin.login);
	app.post('/author/login', middleware.ensureNotAuthenticated, admin.doLogin);

	app.get('/author/logout', middleware.ensureAuthenticated, admin.logout);

	app.get('/author/signup', middleware.ensureNotAuthenticated, admin.signup);
	app.post('/author/signup', middleware.ensureNotAuthenticated, admin.doSignup, admin.doLogin);

	app.get('/author/editor', middleware.ensureAuthenticated, admin.editor);
	app.post('/author/editor', middleware.ensureAuthenticated, admin.doEdit);
}

module.exports = routes;