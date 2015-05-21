'use strict'

/**
 * Serve static files from `rootDir`.
 *
 * Serves all files from a specified directory. Can be used for public and
 * asset folders.
 *
 * @param {String} root
 * @return {Function}
 * @api public
 */

var send = require('koa-send')
var path = require('path')
var fs = require('fs')
var util = require('util')

module.exports = function(rootName, opts) {
    return new function() {

        let finalFiles = []
        let options = opts || {}
        var root = rootName
        let self = this

        if (!root || (typeof root) != 'string')
            throw Error('rootDir must be a valid path.')

        if (!fs.statSync(root).isDirectory())
            throw Error('rootDir should be a directory.')

        finalFiles = walk(root)

        root = fs.realpathSync(root)

        options.root = process.cwd()
        options.index = options.index || "index.html"
        self.root = root
        self.rootDir = path.normalize(util.format("/%s/", path.normalize(rootName)))

        this.serveCached = function() {
            return function*(next) {
                var file = finalFiles[this.path]
                var trailingSlash = '/' == this.path[this.path.length - 1]

                // if file exists or this is directory
                // pass it to koa-send
                if (file || trailingSlash)
                    yield send(this, this.path, options)
                else
                    yield *next
            }
        }

        this.reloadCached = function() {
            finalFiles = walk(self.root)
        }

        // here we check if request path (eg: /doc/file.html) is
        // allowed (eg. in /doc/)
        this.serve = function() {
            return function*(next) {

                var allowed = this.path.indexOf(self.rootDir) === 0
                if (allowed)
                    yield send(this, this.path, options)
                else
                    yield *next

            }
        }

        function walk(directory) {
            let files = fs.readdirSync(directory)

            for(let file of files) {
                file = directory + '/' + file
                if ((fs.statSync(file)).isDirectory())
                    walk(file, finalFiles)
                else
                    finalFiles[path.normalize(file)] = true
            }
            return finalFiles;
        }
    }
}
