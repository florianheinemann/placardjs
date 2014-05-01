'use strict';

var backend = require('../controllers').backend;
var frontend = require('../controllers').frontend;

var router = {
	index: function() {
		return function(req, res, next) {
			res.render('index');
		}
	},
	login: function() {
		return function(req, res, next) {
			res.render('login');
		}
	},
	register: function() {
		return function(req, res, next) {
			res.render('register');
		}
	},
	authenticate: function() {
		return backend.login();
	},
	logout: function() {
		return backend.logout;
	},
	createUser: function() {
		return backend.createUser;
	}
}

module.exports = router;