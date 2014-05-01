'use strict';

var expect = require('chai').expect;
require('./db_util');
var User = require('../../models').User;

describe('User model', function() {
	describe('Hash creation', function() {
		it('should create unique hashes', function (done) {
			User.hashPassword('password 1', function(error1, key1, salt1) {
				User.hashPassword('password 2', function(error2, key2, salt2) {
					expect(key1).not.to.be.null;
					expect(key2).not.to.be.null;
					expect(key1).to.not.deep.equal(key2);
					done();
				})
			});
		});

		it('should create unique salts', function (done) {
			User.hashPassword('password 1', function(error1, key1, salt1) {
				User.hashPassword('password 1', function(error2, key2, salt2) {
					expect(salt1).not.to.be.null;
					expect(salt2).not.to.be.null;
					expect(salt1).to.not.deep.equal(salt2);
					done();
				})
			});
		});

		it('should create same hash for same password and salt', function (done) {
			User.hashPassword('password 1', function(error1, key1, salt1) {
				User.hashPassword('password 1', salt1, function(error2, key2, salt2) {
					expect(key1).not.to.be.null;
					expect(salt1).not.to.be.null;

					expect(key1).to.deep.equal(key2);
					expect(salt1).to.deep.equal(salt2);

					done();
				})
			});
		});
	});

	describe('Hash verification', function() {
		it('should not validate empty passwords', function (done) {
			User.createUser('frank', 'password', true, function(error, user) {
				user.verifyPassword('', function(error, validated) {
					expect(error).to.be.null;
					expect(validated).to.equal(false);
					done();
				})
			});
		});

		it('should not validate wrong passwords', function (done) {
			User.createUser('frank', 'password', true, function(error, user) {
				user.verifyPassword('wrongone', function(error, validated) {
					expect(error).to.be.null;
					expect(validated).to.equal(false);
					done();
				})
			});
		});

		it('should validate correct passwords', function (done) {
			User.createUser('frank', 'password', true, function(error, user) {
				user.verifyPassword('password', function(error, validated) {
					expect(error).to.be.null;
					expect(validated).to.equal(true);
					done();
				})
			});
		});
	});

	describe('Create', function() {
		it('should fail for empty username', function (done) {
			User.createUser('', 'password', true, function(error, user) {
				expect(error).to.be.not.null;
				expect(user).to.not.exist;
				done();
			});
		});

		it('should fail for empty password', function (done) {
			User.createUser('frank', '', true, function(error, user) {
				expect(error).to.be.not.null;
				expect(user).to.not.exist;
				done();
			});
		});

		it('should fail for null admin', function (done) {
			User.createUser('frank', 'password', null, function(error, user) {
				expect(error).to.exist;
				expect(user).to.not.exist;
				done();
			});
		});

		it('should create user - check of count routine', function (done) {
			User.createUser('frank', 'password', true, function(error, user) {
				User.count({ username: 'alice' }, function(error, count) {
					expect(count).to.equal(0);
					done();
				});
			});
		});

		it('should create user - version 1', function (done) {
			User.createUser('frank', 'password', true, function(error, user) {
				User.count({ username: 'frank', isAdmin: true }, function(error, count) {
					expect(count).to.equal(1);
					done();
				});
			});
		});

		it('should create user - version 2', function (done) {
			User.createUser('frank', 'password', false, function(error, user) {
				User.count({ username: 'frank', isAdmin: false }, function(error, count) {
					expect(count).to.equal(1);
					done();
				});
			});
		});

		it('should not duplicate user', function (done) {
			User.createUser('frank', 'password', false, function(error, user) {
				User.count({ username: 'frank', isAdmin: false }, function(error, count) {
					expect(count).to.equal(1);

					User.createUser('frank', 'password', true, function(error, user) { 
						expect(error).to.exist;
						expect(user).to.not.exist;

						User.count({ username: 'frank', isAdmin: false }, function(error, count) {
							expect(count).to.equal(1);
							done();
						});
					});
				});
			});
		});

		it('should not duplicate user - case insensitive', function (done) {
			User.createUser('frank', 'password', false, function(error, user) {
				User.count({ username: 'frank', isAdmin: false }, function(error, count) {
					expect(count).to.equal(1);

					User.createUser('Frank', 'password', true, function(error, user) { 
						expect(error).to.exist;
						expect(user).to.not.exist;

						User.count({ username: /frank/i, isAdmin: false }, function(error, count) {
							expect(count).to.equal(1);
							done();
						});
					});
				});
			});
		});
	});

	describe('Serialization', function() {
		it('should (de)serialize users correctly', function (done) {
			User.createUser('frank', 'password', true, function(error, user) {
				expect(user).to.exist;
				User.serializeUser(user, function(error, id) {
					expect(error).to.not.exist;
					expect(id).to.exist;

					User.deserializeUser(id, function(error, deserializedUser) {
						expect(error).to.not.exist;
						expect(user.username).to.equal(deserializedUser.username);
						expect(user.hash).to.equal(deserializedUser.hash);
						expect(user.salt).to.equal(deserializedUser.salt);
						done();
					});
				});
			});
		});

		it('should create different IDs for different users', function (done) {
			User.createUser('frank', 'password', true, function(error, user1) {
				expect(user1).to.exist;

				User.createUser('alice', 'password', true, function(error, user2) {
					expect(user2).to.exist;

					User.serializeUser(user1, function(error, id1) {
						expect(error).to.not.exist;
						expect(id1).to.exist;

						User.serializeUser(user2, function(error, id2) {
							expect(error).to.not.exist;
							expect(id2).to.exist;
							expect(id2).to.not.equal(id1);
							done();
						});
					});
				});
			});
		});
	});
})