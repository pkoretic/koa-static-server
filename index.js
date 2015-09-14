'use strict'

/**
  Serve static files from `rootDir`.

  Serves files from specified directory at specified path or from root.
  Supports 'index' file.

  @param {Object} options
  @return {Object} - {Function} serve
  @api public
*/

var send = require('koa-send')
var path = require('path')
var normalize = require('path').normalize

module.exports = function(opts) {

    let options = opts || {}
    options.root = path.resolve(options.rootDir || process.cwd())
    options.index = options.index || "index.html"
    let log = options.log || false

    if (typeof options.rootDir != 'string')
        throw Error('rootDir must be specified')

    return function*(next) {

        /* Serve folder as root path - default
         eg. for options
            rootDir = 'web'
        'web/file.txt' will be served as 'http://host/file.txt'
        */
        let path = this.path
        if (!options.rootPath) {
            log && console.log(new Date().toISOString(), path)
            let sent = yield send(this, path, options)
            if (sent)
                return
            else
                return yield *next
        }

        // Check if request path (eg: /doc/file.html) is allowed (eg. in /doc)
        if (path.indexOf(options.rootPath) != 0)
            return yield *next

        /* Serve folders as specified
         eg. for options:
            rootDir = 'web/static'
            rootPath = '/static'

        'web/static/file.txt' will be served as 'http://server/static/file.txt'
        */

        // Redirect non-slashed request to slashed
        // eg. /doc to /doc/

        if (path == options.rootPath)
            return this.redirect(normalize(options.rootPath + "/"))

        if (options.rootPath) {
            path = normalize(path.replace(options.rootPath, "/"))
        }

        log && console.log(new Date().toISOString(), path)
        let sent = yield send(this,  path, options)
        if (sent)
            return
        else
            return yield *next
    }
}
