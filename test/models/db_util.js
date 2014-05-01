'use strict';

var mongoose = require('mongoose');
var db = require('../../models').db;

beforeEach(function (done) {
	db.getConnection();
	for (var i in mongoose.connection.collections) {
		mongoose.connection.collections[i].remove(function() {});
	}

	return done();
});

afterEach(function (done) {
	return done();
});