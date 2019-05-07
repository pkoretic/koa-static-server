'use strict'

var serve = require('..')
var Koa = require('koa')
var app = new Koa()

// root index support
// GET /
// returns index.html
// GET /file.txt
// returns file.txt
app.use(serve({rootDir: 'web', forbidden :['forbidden']}))

app.listen(3000,()=>{
	console.log("listening on port 3000")
	console.log("access 'file.txt' at /file.txt")
})


