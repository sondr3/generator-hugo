'use strict';

var clor = require('clor');
var generators = require('yeoman-generator');
var shelljs = require('shelljs');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);

    var hugoInstalled = ['hugo'].every(function(depend) {
      return shelljs.which(depend);
    });

    if (!hugoInstalled) {
      this.log(clor
        .red.bold('HUGO NOT FOUND\n')
        .reset('Make sure Hugo is either installed\/can be found in your $PATH')
        );
      shelljs.exit(1);
    }
  },

  writing: function() {
    this.fs.copyTpl(
      this.templatePath('config.toml'),
      this.destinationPath('config.toml')
    );

    this.fs.copyTpl(
      this.templatePath('config.prod.toml'),
      this.destinationPath('config.prod.toml')
    );

    this.fs.copy(
      this.templatePath('app'),
      this.destinationPath('src')
    );
  }
});
