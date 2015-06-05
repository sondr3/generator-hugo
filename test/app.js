'use strict';

var path = require('path');
var fs = require('fs');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

function assertObjectContains(obj, content) {
  Object.keys(content).forEach(function(key) {
    if (typeof content[key] === 'object') {
      assertObjectContains(content[key], obj[key]);
    } else {
      assert.equal(content[key], obj[key]);
    }
  });
}

function assertJSONFileContains(filename, content) {
  var obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
  assertObjectContains(obj, content);
}

describe('hugo:app', function() {
  before(function(done) {
    this.answers = {
      projectName: 'hugo',
      projectDescription: 'Test site for hugo',
      projectURL: 'www.test.com',
      authorName: 'Ola Nordmann',
      authorEmail: 'ola.nordmann@gmail.com',
      authorBio: 'A norwegian dude',
      authorTwitter: '0lanordmann',
      uploading: 'None',
      permalinks: 'pretty'
    };
    helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(path.join(__dirname, 'tmp/app'))
      .withPrompts(this.answers)
      .on('end', done);
  });

  it('creates files', function() {
    assert.file([
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.jscsrc',
      '.jshintrc',
      'config.yaml',
      'config.prod.yaml',
      'gulpfile.js',
      'package.json'
    ]);
  });

  it('creates package.json', function() {
    assert.file('package.json');
    assertJSONFileContains('package.json', {
      name: this.answers.projectName,
      version: '0.0.0',
      description: this.answers.projectDescription,
      homepage: this.answers.projectURL,
      author: {
        name: this.answers.authorName,
        email: this.answers.authorEmail
      },
    });
  });
});
