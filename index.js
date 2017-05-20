/*!
 * find-file-up <https://github.com/jonschlinkert/find-file-up>
 *
 * Copyright (c) 2015, 2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var resolve = require('resolve-dir');

/**
 * Find a file, starting with the given directory
 */

module.exports = function(filename, cwd, limit, cb) {
  if (typeof cwd === 'function') {
    cb = cwd;
    cwd = null;
  }

  if (typeof limit === 'function') {
    cb = limit;
    limit = Infinity;
  }

  var dir = cwd ? resolve(cwd) : '.';
  var n = 0;
  var drive = path.resolve(path.sep);

  (function find(dir, next) {
    var fp = path.resolve(dir, filename);

    fileExists(fp, function(err, exists) {
      if (err) {
        next(err);
        return;
      }

      n++;

      if (exists) {
        next(null, fp);
        return;
      }

      if (n >= limit || dir === path.sep || dir === '.' || dir === drive) {
        next();
        return;
      }

      find(path.dirname(dir), next);
    });
  }(dir, cb));
};

module.exports.sync = function(filename, cwd, limit) {
  var dir = cwd ? resolve(cwd) : '.';
  var fp = path.join(dir, filename);
  var n = 0;
  var drive = path.resolve(path.sep);

  if (fs.existsSync(fp)) {
    return path.resolve(fp);
  }

  if (limit === 0) return null;

  while ((dir = path.dirname(dir))) {
    n++;

    var filepath = path.resolve(dir, filename);
    if (fs.existsSync(filepath)) {
      return filepath;
    }

    if (n >= limit || dir === '.' || dir === path.sep || dir === drive) {
      return;
    }
  }
};

/**
 * Returns true if a file exists, since `fs.exists` is deprecated.
 * See: https://nodejs.org/api/fs.html#fs_fs_exists_path_callback
 */

function fileExists(filepath, cb) {
  fs.stat(filepath, function(err) {
    if (err && err.code === 'ENOENT') {
      cb(null, false);
      return;
    }
    if (err) {
      cb(err);
      return;
    }
    cb(null, true);
  });
}
