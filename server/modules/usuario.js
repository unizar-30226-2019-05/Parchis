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
    req.body.dados,
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
  let data = [
    req.params.id
  ]
  bd.compras(data, res)
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
  let data = [
    req.params.id
  ]
  bd.listatotal(data, res)
}

const itemsUsuario = function (req, res) {
  let data = [
    req.params.id
  ]
  bd.itemsUsuario(data, res)
}

const comprobar = function (req, res) {
  let user = req.params.usuario
  let id = req.params.id
  let data = [
    user,
    id,
    id,
    user
  ]
  console.log(user)
  console.log(id)
  bd.comprobar(data, res)
}
const existeUsuario = function (req, res) {
  let data = [
    req.body.nickname,
    req.body.emailadress
  ]
  bd.existeUsuario(data, res)
}
const tienePuntos = function (req, res) {
  let data = [
    req.params.id,
    req.params.articulo
  ]
  bd.tienePuntos(data, res)
}

const avatar = function (req, res) {
  let data = [
    'Editar avatar',
    req.params.id
  ]
  bd.avatar(data, res)
}

const desbloqueo8 = function (req, res) {
  let data = [
    'Tablero 8 jug',
    req.params.id
  ]
  bd.avatar(data, res)
}

const dadosDesbloqueados = function (req, res) {
  let data = [
    'Jugar con 2 dados',
    req.params.id
  ]
  bd.avatar(data, res)
}
const coloresDados = function (req, res) {
  console.log("ENTRA COLOR DADOS 1")
  let data = [
    req.params.color,
    req.params.id
  ]
  bd.avatar(data, res)
}

const sumarPuntos = function (req, res) {
  let data = [
    req.params.puntos,
    req.params.id
  ]
  bd.sumarPuntos(data, res)
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
  itemsUsuario: itemsUsuario,
  comprobar: comprobar,
  existeUsuario: existeUsuario,
  tienePuntos: tienePuntos,
  avatar: avatar,
  desbloqueo8: desbloqueo8,
  dadosDesbloqueados: dadosDesbloqueados,
  sumarPuntos: sumarPuntos,
  coloresDados: coloresDados
}
