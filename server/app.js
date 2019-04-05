
// BASE DE DATOS

const express = require('express')
const app = express()
const routerUsuario = require('./routes/usuario')
const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
}

app.use(allowCrossDomain)

app.use('/api/usuario', routerUsuario)

let port = process.env.PORT || 3000

app.listen(port, function () {
  console.log('Express server listening on port ' + port)
})
