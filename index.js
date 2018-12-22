'use strict'

/**
 * Module dependencies
 */

const assert = require('assert')
const send = require('koa-send')
const normalize = require('upath').normalizeSafe
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

function serve(opts) {
    assert(typeof opts.rootDir === 'string', 'rootDir must be specified (as a string)')

    let options = opts || {}
    options.root = path.resolve(options.rootDir || process.cwd())
    options.index = options.index || "index.html"
    const log = options.log || false
    const rootPath = normalize(options.rootPath ? options.rootPath + "/" : "/")

    return async (ctx, next) => {
        assert(ctx, 'koa context required')

        // skip if this is not a GET/HEAD request
        if (ctx.method !== 'HEAD' && ctx.method !== 'GET')
            return next()

        let path = ctx.path

        // Redirect non-slashed request to slashed, eg. /doc to /doc/
        if (path + '/' === rootPath)
            return ctx.redirect(rootPath)

        // Check if request path (eg: /doc/file.html) is allowed (eg. in /doc)
        if (path.indexOf(rootPath) !== 0)
            return next()

        /* Serve folders as specified
         eg. for options:
          rootDir = 'web/static'
          rootPath = '/static'

        'web/static/file.txt' will be served as 'http://server/static/file.txt'
        */

        path = normalize(path.replace(rootPath, "/"))

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

        if (sent && options.last !== false)
            return
        else
            return next()
    }
}
