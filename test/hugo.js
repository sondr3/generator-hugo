'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;

describe('hugo:hugo', function() {
  describe('default settings', function() {
    before(function(done) {
      this.options = {
        projectName: 'hugo',
        projectDescription: 'Tests for hugo',
        projectURL: 'example.org',
        authorName: 'Ola Nordmann',
        authorEmail: 'ola.nordmann@email.com',
        authorBio: 'I am a tester for tests',
        authorTwitter: '0lanordmann',
        permalinks: 'pretty'
      };
      helpers.run(path.join(__dirname, '../generators/hugo'))
        .inDir(path.join(__dirname, 'tmp/hugo'))
        .withOptions(this.options)
        .on('end', done);
    });

    it('creates config files', function() {
      assert.file('config.yaml');
      assert.file('config.prod.yaml');
    });

    it('config.yaml contains correct settings', function() {
      var expected = [
        ['config.yaml', /baseurl\: "localhost"/],
        ['config.yaml', /title\: "hugo"/],
        ['config.yaml', /Description\: "Tests for hugo"/],
        ['config.yaml', /AuthorName\: "Ola Nordmann"/],
        ['config.yaml', /AuthorBio\: "I am a tester for tests"/],
        ['config.yaml', /AuthorEmail\: "ola.nordmann@email.com"/],
        ['config.yaml', /AuthorTwitter\: "0lanordmann"/],
        ['config.yaml', /buildDrafts\: true/],
        ['config.yaml', /buildFuture\: true/]
      ];

      assert.fileContent(expected);
    });

    it('config.prod.yaml contains correct settings', function() {
      var expected = [
        ['config.prod.yaml', /baseurl\: "localhost"/],
        ['config.prod.yaml', /title\: "hugo"/],
        ['config.prod.yaml', /Description\: "Tests for hugo"/],
        ['config.prod.yaml', /AuthorName\: "Ola Nordmann"/],
        ['config.prod.yaml', /AuthorBio\: "I am a tester for tests"/],
        ['config.prod.yaml', /AuthorEmail\: "ola.nordmann@email.com"/],
        ['config.prod.yaml', /AuthorTwitter\: "0lanordmann"/],
        ['config.prod.yaml', /buildDrafts\: false/],
        ['config.prod.yaml', /buildFuture\: false/]
      ];

      assert.fileContent(expected);
    });

    it('creates correct folder structure', function() {
      assert.file([
        'archetypes/default.md'
      ]);
    });
  });
});
