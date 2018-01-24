'use strict'

var serve = require('..')
var app = new (require('koa'))()

// folder support
// GET /web/
// returns /web/index.html
// GET /web/file.txt
// returns /web/file.txt
app.use(serve({rootDir: 'web', rootPath: '/web'}))

app.listen(3000)

console.log("listening on port 3000")
console.log("access 'file.txt' at /web/file.txt")
