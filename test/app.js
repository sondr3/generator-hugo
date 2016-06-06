'use strict';
var path = require('path');
var test = require('ava');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

test.before(() => {
  var deps = [
    [helpers.createDummyGenerator(), 'statisk:git'],
    [helpers.createDummyGenerator(), 'statisk:editorconfig'],
    [helpers.createDummyGenerator(), 'statisk:gulp'],
    [helpers.createDummyGenerator(), 'statisk:readme'],
    [helpers.createDummyGenerator(), 'hugo:hugo']
  ];

  return helpers.run(path.join(__dirname, '../generators/app'))
    .withPrompts({
      projectName: 'hugo',
      projectDescription: 'Testing hugo',
      projectURL: 'www.test.com',
      authorName: 'Ola Nordmann',
      authorEmail: 'ola.nordmann@gmail.com',
      authorBio: 'A norwegian dude',
      authorTwitter: '0lanordmann',
      uploading: 'None',
      permalinks: 'pretty'
    })
    .withOptions({'skip-install': true})
    .withGenerators(deps)
    .toPromise();
});

test('generates expected files', () => {
  assert.file([
    '.editorconfig',
    '.gitattributes',
    '.gitignore',
    'config.yaml',
    'config.prod.yaml',
    'README.md',
    'gulpfile.js',
    'package.json'
  ]);
});

test('creates package.json correctly', () => {
  assert.file('package.json');
  assert.jsonFileContent('package.json', {
    name: 'hugo',
    description: 'Testing hugo',
    homepage: 'www.test.com',
    author: {
      name: 'Ola Nordmann',
      email: 'ola.nordmann@gmail.com'
    }
  });
});
