'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var generators = require('yeoman-generator');
var shelljs = require('shelljs');
var pkg = require('../../package.json');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('skip-install', {
      desc: 'Skip installing dependencies',
      type: Boolean
    });

    this.option('skip-install-message', {
      desc: 'Skips the installation message',
      type: Boolean,
      defaults: true
    });

    if (!this.options['skip-install']) {
      var dependencies = ['hugo', 'yo', 'gulp', 'node'].every(function (depend) {
        return shelljs.which(depend);
      });

      if (!dependencies) {
        this.log(chalk.red('You are missing one or more dependencies!'));
        this.log(chalk.yellow('Make sure you have the required dependencies, or that they are in $PATH'));
        shelljs.exit(1);
      }
    }
  },

  initializing: function () {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
  },

  prompting: function () {
    var questions = [{
      name: 'projectName',
      message: 'What is the name of your project?',
      store: true
    }, {
      name: 'projectDescription',
      message: 'Describe your project',
      store: true
    }, {
      name: 'projectURL',
      message: chalk.yellow('If you will be using Github Pages, use username.github.io\n') +
        chalk.yellow('? ') + 'What will the URL for your project be?',
      validate: i => i.startsWith('http') ? true : 'URL must contain either HTTP or HTTPs',
      store: true
    }, {
      name: 'authorName',
      message: 'What\'s your name?',
      store: true
    }, {
      name: 'authorEmail',
      message: 'What\'s your email?',
      store: true
    }, {
      name: 'authorURI',
      message: chalk.yellow('Can be the same as this site\n') +
        chalk.yellow('? ') + 'What is your homepage?',
      store: true
    }, {
      name: 'authorBio',
      message: 'Write a short description about yourself',
      store: true
    }, {
      name: 'uploading',
      type: 'list',
      message: 'How do you want to upload your site?',
      choices: ['Amazon S3', 'Rsync', 'Github Pages', 'None'],
      store: true
    }, {
      name: 'babel',
      type: 'confirm',
      message: 'Compile your JS with Babel'
    }, {
      name: 'jekyllPermalinks',
      type: 'list',
      message: 'Permalink style' + (chalk.yellow(
                    '\n   date:     /:categories/:year/:month/:day/:title.html' +
                    '\n   pretty:   /:categories/:year/:month/:day/:title/' +
                    '\n   ordinal:  /:categories/:year/:y_day/:title.html' +
                    '\n   none:     /:categories/:title.html\n')),
      choices: ['date', 'pretty', 'ordinal', 'none'],
      store: true
    }];

    return this.prompt(questions).then(function (props) {
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    var pkgJSONFields = {
      name: _.kebabCase(this.props.projectName),
      version: '0.0.0',
      description: this.props.projectDescription,
      homepage: this.props.projectURL,
      author: {
        name: this.props.authorName,
        email: this.props.authorEmail
      }
    };

    this.fs.writeJSON('package.json', _.extend(pkgJSONFields, this.pkg));
  },

  default: function () {
    this.composeWith('statisk:editorconfig', {}, {
      local: require.resolve('generator-statisk/generators/editorconfig')
    });

    this.composeWith('statisk:git', {}, {
      local: require.resolve('generator-statisk/generators/git')
    });

    this.composeWith('statisk:readme', {
      options: {
        projectName: this.props.projectName,
        projectDescription: this.props.projectDescription,
        projectURL: this.props.projectURL,
        authorName: this.props.authorName,
        content: ``
      }
    }, {
      local: require.resolve('generator-statisk/generators/readme')
    });

    this.composeWith('statisk:gulp', {
      options: {
        name: pkg.name,
        version: pkg.version,
        uploading: this.props.uploading,
        babel: this.props.babel
      }
    }, {
      local: require.resolve('generator-statisk/generators/gulp')
    });

    this.composeWith('hugo:hugo', {
      options: {
        projectName: this.props.projectName,
        projectDescription: this.props.projectDescription,
        projectURL: this.props.projectURL,
        authorName: this.props.authorName,
        authorEmail: this.props.authorEmail,
        authorURI: this.props.authorURI,
        authorBio: this.props.authorBio,
        jekyllPermalinks: this.props.jekyllPermalinks
      }
    }, {
      local: require.resolve('../hugo')
    });
  },

  installing: function () {
    this.log('\nCreating files and running ' + chalk.blue('npm install') + '.\n.');
    this.installDependencies({
      bower: false,
      skipMessage: this.options['skip-install-message'],
      skipInstall: this.options['skip-install']
    });
  }
});
