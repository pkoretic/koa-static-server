# koa-static-server
koajs static middleware with folder and index support

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
 - `maxage` Browser cache max-age in milliseconds. defaults to 0
 - `hidden` Allow transfer of hidden files. defaults to false
 - `root` Root directory to restrict file access
 - `gzip` Try to serve the gzipped version of a file automatically when `gzip`
is supported by a client and if the requested file with `.gz` extension exists.
defaults to true.

## Example

```js
// example 'web' directory
// web/index.html
// web/file.txt

var serve = require('..')
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

//// index support
//// GET /
//// returns /file.txt
app.use(serve({rootDir: 'web', index: 'file.txt'}))

//// rewrite support
//// GET /web/
//// returns 404
//// GET /admin
//// returns /admin/index.html
app.use(serve({rootDir: 'web', rootPath: '/admin'}))

app.listen(3000)

console.log('listening on port 3000')
```

## License

  MIT
