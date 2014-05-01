'use strict';

var PostSchema = require('./post').PostSchema;
var Post = require('./post').Post;

var textPostSchema = new PostSchema({
    markdown: 		{ type: String, required: true }
});

textPostSchema.statics.createPost = function(post, callback) {
	Post.createPost.call(this, post, callback);
};

textPostSchema.statics.newPost = function(data) {
	return new TextPost(data);
};

var TextPost = Post.discriminator('TextPosts', textPostSchema);

module.exports.TextPost = TextPost;