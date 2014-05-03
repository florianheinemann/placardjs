'use strict';

var middleware = require('../middleware');
var frontend = require('../controllers').frontend;

var routes = function(app) {
	app.get('/', frontend.index);
}

module.exports = routes;