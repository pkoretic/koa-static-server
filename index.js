'use strict'

/**
  Serve static files from `rootDir`.

  Serves files from specified directory at specified path or from root.
  Supports 'index' file.

  @param {Object} options
  @return {Object} - has only 'server' function
  @api public
*/

var send = require('koa-send')
var path = require('path')

module.exports = function(opts) {

    let options = opts || {}
    options.root = path.resolve(options.rootDir || process.cwd())
    options.index = options.index || "index.html"

    if (typeof options.rootDir != 'string')
        throw Error('rootDir must be specified')

    return function*(next) {

        /* Serve folder as root path - default
         eg. for options
            rootDir = 'web'
        'web/file.txt' will be served as 'http://host/file.txt'
        */
        if (!options.rootPath)
            return yield send(this, this.path, options)

        // Check if request path (eg: /doc/file.html) is allowed (eg. in /doc)
        if (this.path.indexOf(options.rootPath) != 0)
            return yield * next

        /* Serve folders as specified
         eg. for options:
            rootDir = 'web/static'
            rootPath = '/static'

        'web/static/file.txt' will be served as 'http://server/static/file.txt'
        */
        if (options.rootPath)
            this.path = this.path.replace(options.rootPath, '')

        yield send(this,  this.path, options)
    }
}
