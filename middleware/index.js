'use strict';

module.exports.ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) 
		return next(); 
	res.redirect('/login')
};

module.exports.ensureNotAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) 
		res.redirect('/');
	else
		next(); 
};