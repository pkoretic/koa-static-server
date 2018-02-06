'use strict'

/**
 * Module dependencies
 */

const assert = require('assert')
const send = require('koa-send')
const normalize = require('path').normalize
const path = require('path')

module.exports = serve

/**
 * Serve static files from `rootDir`.
 *
 * Serves files from specified directory at specified path or from root.
 * Supports 'index' file.
 *
 * @param {Object} options
 * @return {Object} - {Function} serve
 * @api public
 */

function serve (opts) {
    assert(typeof opts.rootDir === 'string', 'rootDir must be specified (as a string)')

    let options = opts || {}
    options.root = path.resolve(options.rootDir || process.cwd())
    options.index = options.index || "index.html"
    const log = options.log || false

    return async (ctx, next) => {

        // skip if this is not a GET/HEAD request
        if (ctx.method !== 'HEAD' && ctx.method !== 'GET')
            return next()

        /* Serve folder as root path - default
         eg. for options
            rootDir = 'web'

        'web/file.txt' will be served as 'http://host/file.txt'
        */
        assert(ctx, 'koa context required')
        let path = ctx.path
        if (!options.rootPath) {
            log && console.log(new Date().toISOString(), path)
            const sent = await send(ctx, path, options)
            if (sent)
                return
            else
                return next()
        }

        // Check if request path (eg: /doc/file.html) is allowed (eg. in /doc)
        if (path.indexOf(options.rootPath) !== 0)
            return next()

        /* Serve folders as specified
         eg. for options:
          rootDir = 'web/static'
          rootPath = '/static'

        'web/static/file.txt' will be served as 'http://server/static/file.txt'
        */

        /* Redirect non-slashed request to slashed, excluding the slash itself
         eg. /doc to /doc/ , but not / to /
        */

        if (path === options.rootPath && options.rootPath !== '/')
            return ctx.redirect(normalize(options.rootPath + "/"))

        if (options.rootPath)
            path = normalize(path.replace(options.rootPath, "/"))

        log && console.log(new Date().toISOString(), path)

        let sent

        /* In case of error from koa-send try to serve the default static file
         eg. 404 error page or image that illustrates error
        */
        try {
            sent = await send(ctx, path, options)
        } catch (e) {
            if (!options.notFoundFile)
                throw e;

            sent = await send(ctx, options.notFoundFile, options)
        }

        if (sent)
            return
        else
            return next()
    }
}
