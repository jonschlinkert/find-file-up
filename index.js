/*!
 * find-pkg <https://github.com/jonschlinkert/find-pkg>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/**
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');
var resolve = require('resolve-dir');
var cwd = process.cwd();

/**
 * Find a file, starting with the given directory
 */

module.exports = function findFile(filename, dir, cb) {
  if (typeof dir === 'function') {
    cb = dir;
    dir = '.';
  }

  dir = resolve(dir);

  function find(dir, next) {
    var fp = path.resolve(dir, filename);
    fs.exists(fp, function(exists) {
      if (exists) {
        cb(null, fp);
        return;
      }
      if (dir === cwd || dir === '.' || dir === path.sep) {
        next();
      } else {
        find(path.dirname(dir), next);
      }
    });
  }
  find(resolve(dir), cb);
};

module.exports.sync = function findFileSync(filename, dir) {
  dir = dir ? resolve(dir) : '.';

  function find(dir) {
    var fp = path.resolve(dir, filename);
    if (fs.existsSync(fp)) {
      return fp;
    }
    if (dir === cwd || dir === '.' || dir === path.sep) {
      return;
    }
    return find(path.dirname(dir));
  }
  return find(resolve(dir));
};
