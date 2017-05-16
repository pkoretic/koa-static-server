'use strict'

var serve = require('..')
var app = new (require('koa'))()

// rewrite support
// GET /web/
// returns 404
// GET /admin
// returns /admin/index.html
app.use(serve({rootDir: 'web', rootPath: '/admin'}))

app.listen(3000)

console.log("listening on port 3000")
console.log("access 'file.txt' at /admin/file.txt")
