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

module.exports = function(filename, cwd, cb) {
  if (typeof cwd === 'function') {
    cb = cwd;
    cwd = null;
  }

  var dir = cwd ? resolve(cwd) : '.';

  (function find(dir, next) {
    var filepath = path.resolve(dir, filename);
    exists(filepath, function(exists) {
      if (exists) return next(null, filepath);

      if (dir !== path.sep) {
        return find(path.dirname(dir), next);
      }
      return next();
    });
  }(dir, cb));
};

module.exports.sync = function(filename, cwd) {
  var dir = path.join(cwd ? resolve(cwd) : '.', '_');

  while ((dir = path.dirname(dir)) !== path.sep) {
    var filepath = path.resolve(dir, filename);

    if (existsSync(filepath)) {
      return filepath;
    }
  }
};

/**
 * Utils for checking if a file exists. Uses `fs.access` since
 * `fs.exists` and `fs.existsSync` are deprecated.
 *
 * See: https://nodejs.org/api/fs.html#fs_fs_exists_path_callback
 */

function exists(filepath, cb) {
  (fs.access || fs.stat)(filepath, function(err) {
    if (err) return cb(false);
    return cb(true);
  });
}

function existsSync(filepath) {
  try {
    (fs.accessSync || fs.statSync)(filepath);
    return true;
  } catch (err) {}
  return false
}
