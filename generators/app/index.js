'use strict';

var generator = require('yeoman-generator');

module.exports = generator.Base.extend({
  default: function() {
    this.composeWith('hugo:dotfiles', {}, {
      local: require.resolve('../dotfiles')
    });

    this.composeWith('hugo:hugo', {}, {
      local: require.resolve('../hugo')
    });
  },

  install: function() {
    this.installDependencies();
  }
});
