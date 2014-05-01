'use strict';

var PostSchema = require('./post').PostSchema;
var Post = require('./post').Post;

var linkPostSchema = new PostSchema({
    link: 		{ type: String, required: true },
    markdown: 	{ type: String, required: false }
});

var LinkPost = Post.discriminator('LinkPosts', linkPostSchema);

module.exports.LinkPost = LinkPost;