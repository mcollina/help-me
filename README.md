help-me
=======

Help command for node, to use with [minimist](http://npm.im/minimist) and [commist](http://npm.im/commist).

Example
-------

```js
'use strict'

var helpMe = require('help-me')
var help = helpMe({
  // the default
  dir: path.join(path.dirname(require.main.filename), 'doc'),
  // the default
  ext: '.txt'
})

help
  .createStream(['hello']) // can support also strings
  .pipe(process.stdout)

// little helper to do the same
help.toStdout(['hello']
```

Strict filename match

In case multiple files starts with the same prefix it is useful to resolve them 
using fullname:

```js
'use strict'

var helpMe = require('help-me')
var help = helpMe({
  // the default
  dir: path.join(path.dirname(require.main.filename), 'doc'),
  // the default
  ext: '.txt',
  // default false
  strict: true
})

help
  .createStream(['hello']) // if `doc` contains hello.txt and hello-world.txt only hello.txt will be matched
  .pipe(process.stdout)

help.toStdout(['hello']
```

Usage with commist
------------------

[Commist](http://npm.im/commist) provide a command system for node.

```js
var commist = require('commist')()
var help = require('help-me')()

commist.register('help', help.toStdout)

commist.parse(process.argv.splice(2))
```

Acknowledgements
----------------

This project was kindly sponsored by [nearForm](http://nearform.com).

License
-------

MIT
