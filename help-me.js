
var fs          = require('fs')
  , path        = require('path')
  , through     = require('through2')
  , globStream  = require('glob-stream')
  , concat      = require('callback-stream')
  , xtend       = require('xtend')
  , defaults    = {
        dir: path.join(path.dirname(require.main.filename), 'doc')
      , ext: '.txt'
      , help: 'help'
    }
  , pump = require('pump')


function helpMe(opts) {

  opts = xtend(defaults, opts)

  if (!opts.dir) {
    throw new Error('missing directory')
  }

  return {
    createStream: createStream,
    toStdout: toStdout
  }

  function toPath(name) {
    return path.join(opts.dir, name + opts.ext)
  }

  function createStream(args) {
    if (typeof args === 'string') {
      args = args.split(' ')
    } else if (!args || args.length === 0) {
      args = [opts.help]
    }

    var out         = through()
      , gs          = globStream.create([opts.dir + '/**/*' + opts.ext])
      , re          = new RegExp(args.map(function(arg) {
          return arg + '[a-zA-Z0-9]*'
        }).join('[ /]+'))

    gs.pipe(concat({ objectMode: true }, function(err, files) {
      if (err) return out.emit('error', err)

      files = files.map(function(file) {
        file.relative = file.path.replace(file.base, '')
        return file
      }).filter(function(file) {
        return file.relative.match(re)
      })

      if (files.length === 0) {
        return out.emit('error', new Error('no such help file'))
      } else if (files.length > 1) {
        out.write('There are ' + files.length + ' help pages ')
        out.write('that matches the given request, please disambiguate:\n')
        files.forEach(function(file) {
          out.write('  * ')
          out.write(file.relative.replace(opts.ext, ''))
          out.write('\n')
        })
        out.end()
        return
      }

      fs.createReadStream(files[0].path)
        .on('error', function(err) {
          out.emit('error', err)
        })
        .pipe(out)
    }));

    return out
  }

  function toStdout(args) {
    createStream(args)
      .on('error', function(err) {
        console.log('no such help file\n')
        toStdout()
      })
      .pipe(process.stdout)
  }
}

module.exports = helpMe
