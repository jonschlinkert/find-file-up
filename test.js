/*!
 * find-pkg <https://github.com/jonschlinkert/find-pkg>
 *
 * Copyright (c) 2015 .
 * Licensed under the MIT license.
 */

'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var resolve = require('resolve-dir');
var assert = require('assert');
var findFile = require('./');
var del = require('delete');

describe('find-file', function() {
  it('should resolve a file in the cwd:', function(cb) {
    findFile('index.js', '.', function(err, fp) {
      assert.equal(fp, path.resolve('index.js'));
      cb();
    });
  });

  it('should resolve a file from user home:', function(cb) {
    fs.writeFile(resolve('~/__foo.js'), 'tmp', function(err) {
      if (err) return cb(err);

      findFile('__foo.js', '~/_a/b/c', function(err, fp) {
        assert(fp === resolve('~/__foo.js'));
        del(fp, {force: true}, cb);
      });
    });
  });

  it('should return undefined when the file does not exist:', function(cb) {
    findFile('whatever.js', resolve('~/a/b/c'), function(err, fp) {
      assert(fp === undefined);
      cb();
    });
  });

  it('should resolve a file from one directory up:', function(cb) {
    findFile('index.js', 'test', function(err, fp) {
      assert.equal(fp, path.resolve('index.js'));
      cb();
    });
  });

  it('should limit the number of directories to recurse', function(cb) {
    findFile('b.txt', 'fixtures/a/b/c/d/e', 5, function(err, fp) {
      assert.equal(fp, path.resolve('fixtures/a/b/b.txt'));

      findFile('b.txt', 'fixtures/a/b/c/d/e', 2, function(err, fp) {
        assert.equal(fp, undefined);
        cb();
      });
    });
  });

  it('should resolve index.js from multiple directories up:', function(cb) {
    findFile('index.js', 'test/a/b/c/c/', function(err, fp) {
      assert.equal(fp, path.resolve('index.js'));
      cb();
    });
  });
});

describe('find-file-sync', function() {
  it('should resolve a file in the cwd:', function() {
    var fp = findFile.sync('index.js', '.');
    assert.equal(fp, path.resolve('index.js'));
  });

  it('should resolve a file from user home:', function() {
    fs.writeFileSync(resolve('~/__foo.js'), 'tmp');

    var fp = findFile.sync('__foo.js', '~/_a/b/c');
    assert(fp === resolve('~/__foo.js'));
    del.sync(fp, {force: true});
  });

  it('should return undefined when the file does not exist:', function() {
    var fp = findFile.sync('whatever.js', resolve('~/a/b/c'));
    assert(fp === undefined);
  });

  it('should resolve a file from one directory up:', function() {
    var fp = findFile.sync('index.js', 'test');
    assert.equal(fp, path.resolve('index.js'));
  });

  it('should limit the number of directories to recurse', function() {
    var fp = findFile.sync('b.txt', 'fixtures/a/b/c/d/e');
    assert.equal(fp, path.resolve('fixtures/a/b/b.txt'));

    var fp = findFile.sync('b.txt', 'fixtures/a/b/c/d/e', 3);
    assert.equal(fp, path.resolve('fixtures/a/b/b.txt'));

    var fp = findFile.sync('b.txt', 'fixtures/a/b/c/d/e', 2);
    assert.equal(fp, undefined);
  });

  it('should resolve index.js from multiple directories up:', function() {
    var fp = findFile.sync('index.js', 'test/a/b/c/c/');
    assert.equal(fp, path.resolve('index.js'));
  });
});
