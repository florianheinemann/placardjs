'use strict';

var User = require('../models').User;
var passport = require('passport');

var admin = {

	login: function(req, res, next) {
		res.render('login');
	},

	signup: function(req, res, next) {
		res.render('register');
	},

	logout: function(req, res, next) {
		req.logout();
		res.redirect('/');
	},

	doLogin: passport.authenticate('local', { successRedirect: '/author',
												failureRedirect: '/author/login',
												failureMessage: true }),

	doSignup: function(req, res, next) {
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
	},

	editor: function(req, res, next) {
		res.render('editor', { errors: req.flash('editor') });
	},

	doEdit: function(req, res, next) {
		req.checkBody('title', 'Please provide a title').notEmpty();

		var errors = req.validationErrors();

		if(errors) {
			for (var i = errors.length - 1; i >= 0; i--) {
				req.flash('editor', errors[i].msg);
			};
			res.redirect('/author/editor');
		} else {
			res.redirect('/');
		}
	}
};

module.exports = admin;