const bd = require('../database/query')

const info = function (req, res) {
  let data = [
    req.params.id
  ]
  bd.info(data, res)
}
const registrarUsuario = function (req, res) {
  let data = [
    req.body.nickname,
    req.body.name,
    req.body.emailadress,
    req.body.pass
  ]
  bd.register(data, res)
  // bcrypt.hashSync(req.body.password, 8)
}

const loginUsuario = function (req, res) {
  let data = [
    req.body.emailadress,
    req.body.password
  ]
  bd.login(data, res)
}
const actualizarPerfil = function (req, res) {
  let data = [
    req.body.name,
    req.body.emailadress,
    req.body.url,
    req.params.id
  ]
  bd.actualizarPerfil(data, res)
}
const darBaja = function (req, res) {
  let data = [
    req.params.id
  ]
  bd.darBaja(data, res)
}
const ranking = function (req, res) {
  bd.ranking(res)
}
const listCompras = function (req, res) {
  bd.compras(res)
}

const canjear = function (req, res) {
  let data = [
    req.body.articulo,
    req.params.id
  ]
  bd.canjear(data, res)
}

module.exports = {
  info: info,
  registrarUsuario: registrarUsuario,
  loginUsuario: loginUsuario,
  actualizarPerfil: actualizarPerfil,
  darBaja: darBaja,
  ranking: ranking,
  listCompras: listCompras,
  canjear: canjear
}
