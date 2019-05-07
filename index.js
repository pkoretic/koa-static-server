'use strict'

/**
 * Module dependencies
 */

const assert = require('assert')
const send = require('koa-send')
const normalize = require('upath').normalizeSafe
const join = require('path').join;
const resolve = require('path').resolve;
const fs = require('fs').promises;

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
    options.root = resolve(options.rootDir || process.cwd())
    options.index = options.index || "index.html"
    const log = options.log || false
    const rootPath = normalize(options.rootPath ? options.rootPath + "/" : "/")
    const forbidden = opts.forbidden || [];

    return async (ctx, next) => {
        assert(ctx, 'koa context required')

        // skip if this is not a GET/HEAD request
        if (ctx.method !== 'HEAD' && ctx.method !== 'GET') {
            return next()
        }

        let path = ctx.path

        // Redirect non-slashed request to slashed, eg. /doc to /doc/
        if (path + '/' === rootPath) {
            return ctx.redirect(rootPath)
        }

        // Check if request path (eg: /doc/file.html) is allowed (eg. in /doc)
        if (path.indexOf(rootPath) !== 0) {
            return next()
        }

        /* Serve folders as specified
         eg. for options:
          rootDir = 'web/static'
          rootPath = '/static'

        'web/static/file.txt' will be served as 'http://server/static/file.txt'
        */

        path = normalize(path.replace(rootPath, "/"))

        /**
         * If folder is in forbidden list,refuse request
         */
        if (forbidden.length > 0) {
            for (let folder of forbidden) {
                folder = new RegExp(`\/${folder}\/`, 'i');
                if (folder.test(path)) {
                    ctx.status = 403;
                    ctx.body = "FORBIDDEN FOLDER"
                    return false;
                }
            }
        }

        /**
         * If someone trying to visit a folder, refust him or her
         */
        let CurrentPath = join(opts.rootDir, path); 
        const stat = await fs.stat(CurrentPath);
        if(stat.isDirectory()){
            ctx.status = 403;
            ctx.body = "IT IS NOT ALLOWED TO VISIT FOLDER"
            return false;
        }

        /**
         * LOG
         */
        log && console.log(new Date().toISOString(), path)

        let sent

        /* In case of error from koa-send try to serve the default static file
         eg. 404 error page or image that illustrates error
        */
        try {
            sent = await send(ctx, path, options)
        } catch (error) {
            if (!options.notFoundFile) {
                ctx.throw(404);
            } else {
                sent = await send(ctx, options.notFoundFile, options)
            }
        }

        if (sent && options.last !== false) {
            return
        } else {
            return next()
        }
    }
}
