
var fs = require('fs')
  , path = require('path')
  , PassThrough = require('readable-stream').PassThrough
  , xtend = require('xtend')
  , defaults = {
        dir: path.join(path.dirname(require.main.filename), 'doc')
      , ext: '.txt'
    }
  , pump = require('pump')


function helpMe(opts) {

  opts = xtend(defaults, opts)

  var out         = new PassThrough()
    , toStream    = toPath('help')

  if (!opts.dir) {
    throw new Error('missing directory')
  }

  if (typeof opts.args === 'string') {
    toStream = toPath(opts.args)
  } else if (opts.args && opts.args.length > 0) {
    toStream = toPath(opts.args[0])
  }

  return fs.createReadStream(toStream)
    .on('error', function(err) {
      out.emit('error', err)
    })
    .pipe(out)

  function toPath(name) {
    return path.join(opts.dir, name + opts.ext)
  }
}

module.exports = helpMe
