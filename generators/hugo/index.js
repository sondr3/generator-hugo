'use strict';

var chalk = require('chalk');
var shelljs = require('shelljs');
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);

    var dependenciesInstalled = ['hugo'].every(function(depend) {
      return shelljs.which(depend);
    });

    if (!dependenciesInstalled) {
      this.log(chalk.red('HUGO NOT FOUND:') +
          '\nEither it\'s not installed or missing from $PATH.' +
          '\nMake sure it\'s properly installed.');
      shelljs.exit(1);
    }

    this.option('projectName', {
      type: String,
      required: true,
      desc: 'Project name'
    });

    this.option('projectDescription', {
      type: String,
      required: true,
      desc: 'Project description'
    });

    this.option('projectURL', {
      type: String,
      required: true,
      desc: 'Project URL'
    });

    this.option('authorName', {
      type: String,
      required: true,
      desc: 'Author name'
    });

    this.option('authorEmail', {
      type: String,
      required: true,
      desc: 'Author email'
    });

    this.option('authorBio', {
      type: String,
      required: true,
      desc: 'Author bio'
    });

    this.option('authorTwitter', {
      type: String,
      required: true,
      desc: 'Author twitter'
    });

    this.option('permalinks', {
      type: String,
      required: true,
      desc: 'Permalinks'
    });
  },

  writing: function() {
    this.fs.copyTpl(
      this.templatePath('config.yaml'),
      this.destinationPath('config.yaml'),
      {
        projectName: this.options.projectName,
        projectDescription: this.options.projectDescription,
        projectURL: this.options.projectURL,
        authorName: this.options.authorName,
        authorEmail: this.options.authorEmail,
        authorBio: this.options.authorBio,
        authorTwitter: this.options.authorTwitter,
        permalinks: this.options.permalinks
      }
    );

    this.fs.copyTpl(
      this.templatePath('config.prod.yaml'),
      this.destinationPath('config.prod.yaml'),
      {
        projectName: this.options.projectName,
        projectDescription: this.options.projectDescription,
        projectURL: this.options.projectURL,
        authorName: this.options.authorName,
        authorEmail: this.options.authorEmail,
        authorBio: this.options.authorBio,
        authorTwitter: this.options.authorTwitter,
        permalinks: this.options.permalinks
      }
    );

    this.fs.copy(
      this.templatePath('archetypes'),
      this.destinationPath('archetypes')
    );

    this.fs.copy(
      this.templatePath('content'),
      this.destinationPath('content')
    );

    this.fs.copy(
      this.templatePath('data'),
      this.destinationPath('data')
    );

    this.fs.copy(
      this.templatePath('layouts'),
      this.destinationPath('layouts')
    );

    this.fs.copy(
      this.templatePath('static'),
      this.destinationPath('static')
    );

  }
});
