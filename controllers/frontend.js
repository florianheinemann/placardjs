'use strict';

var frontend = {
	index: function(req, res, next) {
			res.render('index');
	}
}

module.exports = frontend;