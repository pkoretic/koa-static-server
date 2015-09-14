# koa-static-server

[![GitHub license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/pkoretic/koa-static-server/blob/master/LICENSE)  
[![NPM](https://nodei.co/npm/koa-static-server.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/koa-static-server)

static file serving middleware for koa with directory, rewrite and index support

## Installation

```bash
$ npm install koa-static-server
```

## API

```js
var koa = require('koa')
var app = koa()
app.use(require('koa-static')(options))
```


### Options

 - `rootDir` {string} directory that is to be server
 - `rootPath` {string} optional rewrite path
 - `log` {boolean} request access log to console
 - `maxage` Browser cache max-age in milliseconds. defaults to 0
 - `hidden` Allow transfer of hidden files. defaults to false
 - `gzip` Try to serve the gzipped version of a file automatically when `gzip`
is supported by a client and if the requested file with `.gz` extension exists.
defaults to true.

## Example
See [examples](https://github.com/pkoretic/koa-static-server/tree/master/examples) for code examples

```js
// example 'web' directory
// web/index.html
// web/file.txt

var serve = require('koa-static-server')
var app = require('koa')()

// root index support
// GET /
// returns index.html
// GET /file.txt
// returns file.txt
app.use(serve({rootDir: 'web'}))

// folder support
// GET /web/
// returns /web/index.html
// GET /web/file.txt
// returns /web/file.txt
app.use(serve({rootDir: 'web', rootPath: '/web'}))

// index support
// GET /
// returns /file.txt
app.use(serve({rootDir: 'web', index: 'file.txt'}))

// rewrite support
// GET /web/
// returns 404
// GET /admin
// returns /admin/index.html
app.use(serve({rootDir: 'web', rootPath: '/admin'}))

app.listen(3000)

console.log('listening on port 3000')
```

## Support

 * Issues - [open new issue](https://github.com/pkoretic/koa-static-server/issues)
 * IRC - `pkoretic` on freenode
 * mail - petar.koretic@gmail.com


## License

  MIT

