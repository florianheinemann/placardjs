'use strict';

module.exports = {
	db: require('./db'),
	User: require('./user').User,
	Post: require('./post').Post,
	TextPost: require('./textPost').TextPost,
	LinkPost: require('./linkPost').LinkPost
};
