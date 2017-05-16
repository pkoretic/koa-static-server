'use strict'

var serve = require('..')
var app = new (require('koa'))()

// root index support
// GET /
// returns index.html
// GET /file.txt
// returns file.txt
app.use(serve({rootDir: 'web'}))

app.listen(3000)

console.log("listening on port 3000")
console.log("access 'file.txt' at /file.txt")
