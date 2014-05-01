module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-env');

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
			}
		}
	});

	grunt.registerTask('test', ['env:test', 'mochaTest']);

};