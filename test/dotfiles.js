'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('hugo:dotfiles', function() {
  before(function(done) {
    helpers.run(path.join(__dirname, '../generators/dotfiles'))
      .on('end', done);
  });

  it('creates .editorconfig', function() {
    assert.file('.editorconfig');
  });

  it('creates .jshintrc', function() {
    assert.file('.jshintrc');
  });

  it('creates .jscsrc', function() {
    assert.file('.jscsrc');
  });

  it('creates .gitignore', function() {
    assert.file('.gitignore');
  });

  it('creates .gitattributes', function() {
    assert.file('.gitattributes');
  });
});
