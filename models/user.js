'use strict';

var util = require('util');
var db = require('./db').getConnection();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var userSchema = new Schema({
	username: 		{ type: String, required: true },
	hash: 			{ type: String, required: true },
	salt: 			{ type: String, required: true },
	isAdmin: 		{ type: Boolean, required: true, default: false }
});

userSchema.methods.verifyPassword = function(password, callback) {
	if(!password)
		return callback(null, false);

	var originalHash = this.hash;
	User.hashPassword(password, this.salt, function(error, hash, salt) {
		if(error)
			return callback(error);
		callback(null, hash === originalHash);
	});
};

userSchema.statics.hashPassword = function(plainPassword, salt, callback) {
	// Make salt optional
	if(callback === undefined && salt instanceof Function) {
		callback = salt;
		salt = undefined;
	}

	if(typeof salt === 'string') {
		salt = new Buffer(salt, 'hex');
	}

	var calcHash = function() {
		crypto.pbkdf2(plainPassword, salt, 10000, 64, function(err, key) {
			if(err)
				return callback(err);
			callback(null, key.toString('hex'), salt.toString('hex'));
		})		
	};

	if(!salt) {
		crypto.randomBytes(64, function(err, gensalt) {
			if(err)
				return callback(err);
			salt = gensalt;
			calcHash();
		});		
	} else {
		calcHash();
	}
};

userSchema.statics.serializeUser = function(user, done) {
    done(null, user.id);
};

userSchema.statics.deserializeUser = function(id, done) {
	User.findById(id, done);
};

userSchema.statics.createUser = function(username, password, admin, callback) {
	if(!username || !password)
		return callback('No username or password provided')

	this.findOne({ username: new RegExp('^'+username+'$', "i") }, function(error, user) {
		if(error) {
			callback(error);
		} else if(!user) {
			User.hashPassword(password, function(error, hash, salt) {
				if(error)
					return callback(error);
				var newUser = new User({
					username: username,
					hash: hash,
					salt: salt,
					isAdmin: admin
				});
				newUser.save(callback);
			});
		} else {
			callback('This user already exists');
		}
	})
};

var User = db.model('Users', userSchema);

module.exports.User = User;