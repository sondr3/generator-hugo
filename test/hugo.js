'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;

describe('hugo:hugo', function() {
  describe('default settings', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../generators/hugo'))
        .inDir(path.join(__dirname, 'tmp/hugo'))
        .on('end', done);
    });

    it('creates config files', function() {
      assert.file('config.toml');
      assert.file('config.prod.toml');
    });
  });
});
