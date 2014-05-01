'use strict';

var expect = require('chai').expect;
require('./db_util');
var Post = require('../../models').Post;

function getBasePost() {
	return {
		title: 'Test post',
		permaLink: 'http://www.example.com/123',
		draftStatus: true,
		createdAt: new Date()
	};
};

describe('Post model', function() {
	describe('Create', function() {
		it('should not allow the creation of an abstract post', function (done) {
			var basePost = getBasePost();
			expect(function() {
				Post.createPost(basePost, function(error, post) {
				done('Callback should not be called');
			})}).to.throw(Error);
			done();
		});

		it('should fail for not existing title', function (done) {
			var basePost = getBasePost();
			delete basePost.title;
			Post.createPost(basePost, function(error, post) {
				expect(error).to.exist;
				expect(post).to.not.exist;
				Post.count({ permaLink: getBasePost().permaLink }, function(error, count) {
					expect(count).to.equal(0);
					done();
				});
			});
		});

		it('should fail for not existing permaLink', function (done) {
			var basePost = getBasePost();
			delete basePost.permaLink;
			Post.createPost(basePost, function(error, post) {
				expect(error).to.exist;
				expect(post).to.not.exist;
				Post.count({ title: getBasePost().title }, function(error, count) {
					expect(count).to.equal(0);
					done();
				});
			});
		});

		it('should fail for not existing draftStatus', function (done) {
			var basePost = getBasePost();
			delete basePost.draftStatus;
			Post.createPost(basePost, function(error, post) {
				expect(error).to.exist;
				expect(post).to.not.exist;
				Post.count({ title: getBasePost().title }, function(error, count) {
					expect(count).to.equal(0);
					done();
				});
			});
		});

		it('should fail for not existing createdAt', function (done) {
			var basePost = getBasePost();
			delete basePost.createdAt;
			Post.createPost(basePost, function(error, post) {
				expect(error).to.exist;
				expect(post).to.not.exist;
				Post.count({ title: getBasePost().title }, function(error, count) {
					expect(count).to.equal(0);
					done();
				});
			});
		});
	});
});