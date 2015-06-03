'use strict';

var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  writing: function() {
    this.fs.copyTpl(
      this.templatePath('config.toml'),
      this.destinationPath('config.toml')
    );

    this.fs.copyTpl(
      this.templatePath('config.prod.toml'),
      this.destinationPath('config.prod.toml')
    );

  }
});
