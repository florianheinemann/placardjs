'use strict';

var User = require('../models').User;
var passport = require('passport');

var backend = {
	login: function() {
		return passport.authenticate('local', { successRedirect: '/',
												failureRedirect: '/login',
												failureMessage: true });
	},

	logout: function(req, res, next) {
		req.logout();
		res.redirect('/');
	},

	createUser: function(req, res, next) {
		if(!req.body.username || !req.body.password) {
			return res.json(401, {error: 'Please provide all necessary data'});
		}

		User.createUser(req.body.username, req.body.password, true, function(error, user) {
			if(error) {
				// TODO: We shouldn't leak internal error messages
				res.json(401, {error: error});
			} else if(user) {
				next();
			} else {
				// TODO: throw
			}
		});
	}
};

module.exports = backend;