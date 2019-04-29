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
  console.log('Llega a data')
  let data = [
    req.params.articulo,
    req.params.id
  ]
  console.log('Llama a la bd canjear')
  bd.canjear(data, res)
}

const aceptarUsuario = function (req, res) {
  let data = [
    req.params.id,
    req.params.usuario
  ]
  bd.amigos(data, res)
}
// usuarios aceptados
const listUsuarios = function (req, res) {
  let data = []
  let tipo = req.params.tipo
  let user = req.params.id
  console.log('Tipo:' + tipo)
  console.log('User:' + user)
  data = [
    user,
    'aceptado',
    user,
    'aceptado'
  ]
  bd.listUsuarios(data, res)
}

const listSolicitud = function (req, res) {
  let data = []
  let tipo = req.params.tipo
  let user = req.params.id
  console.log('Tipo:' + tipo)
  console.log('User:' + user)
  data = [
    user,
    'pendiente'
  ]
  bd.listSolicitudes(data, res)
}

const anyadir = function (req, res) {
  let user = req.params.usuario
  let id = req.params.id
  let data = [
    user,
    id,
    'pendiente'
  ]
  bd.anyadir(data, res)
}

const listatotal = function (req, res) {
  bd.listatotal(res)
}

const itemsUsuario = function (req, res) {
  let data = [
    req.params.id
  ]
  bd.itemsUsuario(data, res)
}

module.exports = {
  info: info,
  registrarUsuario: registrarUsuario,
  loginUsuario: loginUsuario,
  actualizarPerfil: actualizarPerfil,
  darBaja: darBaja,
  ranking: ranking,
  listCompras: listCompras,
  canjear: canjear,
  aceptarUsuario: aceptarUsuario,
  listUsuarios: listUsuarios,
  anyadir: anyadir,
  listSolicitud: listSolicitud,
  listatotal: listatotal,
  itemsUsuario: itemsUsuario
}
