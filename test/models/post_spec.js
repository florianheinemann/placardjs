'use strict';

var expect = require('chai').expect;
require('./db_util');
var Post = require('../../models').Post;
var PostSchema = require('../../models/post').PostSchema;

var testPostSchema = new PostSchema({ });

testPostSchema.statics.createPost = function(post, callback) {
	Post.createPost.call(this, post, callback);
};

testPostSchema.statics.newPost = function(data) {
	return new TestPost(data);
};

var TestPost = Post.discriminator('TestPosts', testPostSchema);

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
			TestPost.createPost(basePost, function(error, post) {
				expect(error).to.exist;
				expect(post).to.not.exist;
				TestPost.count({ permaLink: getBasePost().permaLink }, function(error, count) {
					expect(count).to.equal(0);
					done();
				});
			});
		});

		it('should fail for not existing permaLink', function (done) {
			var basePost = getBasePost();
			delete basePost.permaLink;
			TestPost.createPost(basePost, function(error, post) {
				expect(error).to.exist;
				expect(post).to.not.exist;
				TestPost.count({ title: getBasePost().title }, function(error, count) {
					expect(count).to.equal(0);
					done();
				});
			});
		});

		it('should default to true for draftStatus', function (done) {
			var basePost = getBasePost();
			delete basePost.draftStatus;
			TestPost.createPost(basePost, function(error, post) {
				expect(error).to.not.exist;
				expect(post).to.exist;
				TestPost.count({ title: getBasePost().title, draftStatus: true }, function(error, count) {
					expect(count).to.equal(1);
					done();
				});
			});
		});

		it('should default to now() for createdAt', function (done) {
			var basePost = getBasePost();
			delete basePost.createdAt;
			TestPost.createPost(basePost, function(error, post) {
				expect(error).to.not.exist;
				expect(post).to.exist;
				TestPost.count({ title: getBasePost().title, createdAt: { $gte: (Date.now() - 5000) } }, function(error, count) {
					expect(count).to.equal(1);
					done();
				});
			});
		});
	});
});