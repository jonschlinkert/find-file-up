'use strict';

require('mocha');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const write = require('write');
const resolve = require('resolve-dir');
const del = require('delete');
const find = require('./');

describe('find-file', function() {
  describe('async', function() {
    it('should resolve a file in the cwd when . is given', function(cb) {
      find('index.js', '.', function(err, file) {
        if (err) return cb(err);
        assert.equal(file, path.resolve('index.js'));
        cb();
      });
    });

    it('should resolve a file in the cwd', function(cb) {
      find('index.js', function(err, file) {
        if (err) return cb(err);
        assert.equal(file, path.resolve('index.js'));
        cb();
      });
    });

    it('should resolve a file from user home:', function(cb) {
      fs.writeFile(resolve('~/__foo.js'), 'tmp', function(err) {
        if (err) return cb(err);

        find('__foo.js', '~/_a/b/c', function(err, file) {
          if (err) return cb(err);
          assert.equal(file, resolve('~/__foo.js'));
          del(file, {force: true}, cb);
        });
      });
    });

    it('should return undefined when the file does not exist:', function(cb) {
      find('whatever.js', resolve('~/a/b/c'), function(err, file) {
        if (err) return cb(err);
        assert.equal(file, undefined);
        cb();
      });
    });

    it('should resolve a file from one directory up:', function(cb) {
      find('index.js', 'test', function(err, file) {
        if (err) return cb(err);
        assert.equal(file, path.resolve('index.js'));
        cb();
      });
    });

    it('should limit the number of directories to recurse', function(cb) {
      find('b.txt', 'fixtures/a/b/c/d/e', 5, function(err, file) {
        if (err) return cb(err);
        assert.equal(file, path.resolve('fixtures/a/b/b.txt'));

        find('b.txt', 'fixtures/a/b/c/d/e', 2, function(err, file) {
          if (err) return cb(err);
          assert.equal(file, undefined);
          cb();
        });
      });
    });

    it('should resolve index.js from multiple directories up:', function(cb) {
      find('index.js', 'test/a/b/c/c/', function(err, file) {
        if (err) return cb(err);
        assert.equal(file, path.resolve('index.js'));
        cb();
      });
    });
  });

  describe('promise', function() {
    it('should resolve a file in the cwd when . is given', async() => {
      const file = await find('index.js', '.');
      assert.equal(file, path.resolve('index.js'));
    });

    it('should resolve a file in the cwd', async() => {
      const file = await find('index.js');
      assert.equal(file, path.resolve('index.js'));
    });

    it('should resolve a file from user home:', async() => {
      await write(path.resolve(resolve('~/__finduptestfile.js')), 'tmp');
      const file = await find('__finduptestfile.js', '~/_a/b/c');
      assert.equal(file, resolve('~/__finduptestfile.js'));
      return del(file, { force: true });
    });

    it('should return undefined when the file does not exist:', async() => {
      const file = await find('whatever.js', resolve('~/a/b/c'));
      assert(!file);
    });

    it('should resolve a file from one directory up:', async() => {
      const file = await find('index.js', 'test');
      assert.equal(file, path.resolve('index.js'));
    });

    it('should limit the number of directories to recurse', async() => {
      let file = await find('b.txt', 'fixtures/a/b/c/d/e', 5);
      assert.equal(file, path.resolve('fixtures/a/b/b.txt'));

      file = await find('b.txt', 'fixtures/a/b/c/d/e', 2);
      assert(!file);
    });

    it('should resolve index.js from multiple directories up:', async() => {
      const file = await find('index.js', 'test/a/b/c/c/');
      assert.equal(file, path.resolve('index.js'));
    });
  });

  describe('sync', function() {
    it('should resolve a file in the cwd:', function() {
      const file = find.sync('index.js', '.');
      assert.equal(file, path.resolve('index.js'));
    });

    it('should resolve a file from user home:', function() {
      fs.writeFileSync(resolve('~/__foo.js'), 'tmp');

      const file = find.sync('__foo.js', '~/_a/b/c');
      assert.equal(file, resolve('~/__foo.js'));
      del.sync(file, {force: true});
    });

    it('should return undefined when the file does not exist:', function() {
      const file = find.sync('whatever.js', resolve('~/a/b/c'));
      assert.equal(file, undefined);
    });

    it('should resolve a file from one directory up:', function() {
      const file = find.sync('index.js', 'test');
      assert.equal(file, path.resolve('index.js'));
    });

    it('should limit the number of directories to recurse', function() {
      let file = find.sync('b.txt', 'fixtures/a/b/c/d/e');
      assert.equal(file, path.resolve('fixtures/a/b/b.txt'));

      file = find.sync('b.txt', 'fixtures/a/b/c/d/e', 3);
      assert.equal(file, path.resolve('fixtures/a/b/b.txt'));

      file = find.sync('b.txt', 'fixtures/a/b/c/d/e', 2);
      assert.equal(file, undefined);
    });

    it('should resolve index.js from multiple directories up:', function() {
      const file = find.sync('index.js', 'test/a/b/c/c/');
      assert.equal(file, path.resolve('index.js'));
    });
  });
});
