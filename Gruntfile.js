module.exports = function(grunt) {
    grunt.initConfig({
        react: {
            jsx: {
                files: [{
                    expand: true,
                    cwd: './src',
                    src: ['**/*.jsx'],
                    dest: './src',
                    ext: '.jsx.js'
                }]
            }
        },
    });

    grunt.loadNpmTasks('grunt-react');

    grunt.registerTask('default', ['react:jsx']);
};
