'use strict';

var util = require('util');
var db = require('./db').getConnection();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AbstractPostSchema = function AbstractPostSchema() {
	Schema.apply(this, arguments);

	var dataFields = {
		title: 			{ type: String, required: true },
		permaLink: 		{ type: String, required: true },
		cachedHTML: 	{ type: String, required: false },
		cachedAt: 		{ type: Date, required: false },
		draftStatus:	{ type: Boolean, required: true, default: true },
		createdAt: 		{ type: Date, required: true, default: Date.now },
		modifiedAt: 	{ type: Date, required: false, default: Date.now }
	};

	this.add(dataFields);

	this.statics.findAllPublishedPosts = function(callback) {
		this.find( { draftStatus: false }, callback);
	}

	this.statics.newPost = function(data) {
		throw new Error('Do not create abstract posts');
	}

	this.statics.createPost = function(post, callback) {
		if(this.modelName === 'Posts') {
			throw new Error('Do not create abstract posts');
		}

		var newPost = this.newPost(post);
		newPost.save(callback);
	}
};
util.inherits(AbstractPostSchema, Schema);

var postSchema = new AbstractPostSchema();

var Post = db.model('Posts', postSchema);

module.exports.PostSchema = AbstractPostSchema;
module.exports.Post = Post;