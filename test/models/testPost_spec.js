'use strict';

var expect = require('chai').expect;
require('./db_util');
var TextPost = require('../../models').TextPost;

function getBasePost() {
	return {
		title: 'Test post',
		permaLink: 'http://www.example.com/123',
		draftStatus: true,
		createdAt: new Date()
	};
};

describe('TextPost model', function() {
	describe('Create', function() {
		it('should fail for not existing markdown', function (done) {
			TextPost.createPost(getBasePost(), function(error, post) {
				expect(error).to.exist;
				expect(post).to.not.exist;
				TextPost.count({ title: getBasePost().title }, function(error, count) {
					expect(count).to.equal(0);
					done();
				});
			});
		});

		it('should fail for empty markdown', function (done) {
			var basePost = getBasePost();
			basePost.markdown = '';
			TextPost.createPost(basePost, function(error, post) {
				expect(error).to.exist;
				expect(post).to.not.exist;
				TextPost.count({ title: getBasePost().title }, function(error, count) {
					expect(count).to.equal(0);
					done();
				});
			});
		});

		it('should create post - version 1', function (done) {
			var basePost = getBasePost();
			basePost.markdown = 'some markdown';
			TextPost.createPost(basePost, function(error, post) {
				expect(error).to.not.exist;
				expect(post).to.exist;
				TextPost.count({ title: getBasePost().title }, function(error, count) {
					expect(count).to.equal(1);
					done();
				});
			});
		});
	});
});