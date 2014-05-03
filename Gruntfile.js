module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-nodemon');

	grunt.initConfig({
		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['test/**/*.js']
			}
		}, 
		env : {
			options : {
			 //Shared Options Hash
			},
			test : {
				src : '.test.env',
			},
			dev : {
				src : '.dev.env',
			}
		},
		nodemon: {
			dev: {
				script: 'app.js'
			}
		}
	});

	grunt.registerTask('test', ['env:test', 'mochaTest:test']);
	grunt.registerTask('dev', ['env:dev', 'nodemon:dev']);

};