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
		createdAt: Date.now()
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

		it('should fail for non-unique permaLink', function (done) {
			var basePost1 = getBasePost(), basePost2 = getBasePost();

			TestPost.createPost(basePost1, function(error, post) {
				expect(error).to.not.exist;
				expect(post).to.exist;
				TestPost.createPost(basePost2, function(error, post2) {
					expect(error).to.exist;
					expect(post2).to.not.exist;
					TestPost.count({ title: getBasePost().title, draftStatus: true }, function(error, count) {
						expect(count).to.equal(1);
						done();
					});
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

		it('should default to now() for modifiedAt', function (done) {
			var basePost = getBasePost();
			expect(basePost.hasOwnProperty('modifiedAt')).to.be.false;
			TestPost.createPost(basePost, function(error, post) {
				expect(error).to.not.exist;
				expect(post).to.exist;
				TestPost.count({ title: getBasePost().title, modifiedAt: { $gte: (Date.now() - 5000) } }, function(error, count) {
					expect(count).to.equal(1);
					done();
				});
			});
		});
	});


	describe('Find all', function() {
		it('should return nothing where there is nothing', function (done) {
			Post.findAllPublishedPosts(function(error, posts) {
				expect(error).to.not.exist;
				expect(posts.length).to.equal(0);
				done();
			});
		});

		it('should return all published posts, but not drafts', function (done) {
			var basePost1 = getBasePost(), basePost2 = getBasePost(), basePost3 = getBasePost();
			basePost1.draftStatus = basePost2.draftStatus = false;
			basePost3.draftStatus = true;
			basePost2.permaLink = basePost2.permaLink + '_2';
			basePost3.permaLink = basePost3.permaLink + '_draft';

			TestPost.createPost(basePost1, function(error, post) {
				TestPost.createPost(basePost2, function(error, post) {
					Post.findAllPublishedPosts(function(error, posts) {
						expect(error).to.not.exist;
						expect(posts.length).to.equal(2);
						for (var i = posts.length - 1; i >= 0; i--) {
							expect(posts[i].permaLink).to.not.equal(basePost3.permaLink);
						};
						done();
					});					
				});	
			});
		});

		it('should return all published posts in desc. order of their modified date', function (done) {
			var basePost = [];
			for (var i = 0; i < 3; i++) {
				basePost[i] = getBasePost();
				basePost[i].draftStatus = false;
				basePost[i].permaLink = i.toString();
			};

			var now = Date.now();
			basePost[0].modifiedAt = now + 10 * 1000;
			basePost[2].modifiedAt = now + 5 * 1000;

			TestPost.createPost(basePost[0], function(error, post) {
				TestPost.createPost(basePost[1], function(error, post) {
					TestPost.createPost(basePost[2], function(error, post) {
						Post.findAllPublishedPosts(function(error, posts) {
							expect(error).to.not.exist;
							expect(posts.length).to.equal(3);
							expect(posts[0].permaLink).to.equal('0');
							expect(posts[1].permaLink).to.equal('2');
							expect(posts[2].permaLink).to.equal('1');
							done();
						});	
					});	
				});	
			});
		});
	});
});