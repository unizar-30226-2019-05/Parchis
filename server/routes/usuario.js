'use strict'
const express = require('express')
// const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const router = express.Router()
const usuario = require('../modules/usuario')
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.post('/info/:id', usuario.info)
router.post('/register', usuario.registrarUsuario)
router.post('/existeUsuario', usuario.existeUsuario)
router.post('/login', usuario.loginUsuario)
router.post('/actualizarPerfil/:id', usuario.actualizarPerfil)
router.post('/dardebaja/:id', usuario.darBaja)
router.post('/anyadir/:id/:usuario', usuario.anyadir)
router.post('/comprobar/:id/:usuario', usuario.comprobar)
router.post('/aceptarUsuario/:usuario/:id', usuario.aceptarUsuario)
router.get('/listranking', usuario.ranking)
router.get('/listcompras/:id', usuario.listCompras)
router.get('/canjearItem/:id/:articulo', usuario.canjear)
router.get('/listusuarios/:id/:tipo', usuario.listUsuarios)
router.get('/listatotal/:id', usuario.listatotal)
router.get('/listsolicitud/:id/:tipo', usuario.listSolicitud)
router.get('/listitems/:id', usuario.itemsUsuario)
router.get('/tienePuntos/:id/:articulo', usuario.tienePuntos)
router.get('/avatar/:id', usuario.avatar)
router.get('/desbloqueo8/:id', usuario.desbloqueo8)
router.get('/dadosDesbloqueados/:id', usuario.dadosDesbloqueados)
router.post('/sumarPuntos/:id/:puntos', usuario.sumarPuntos)
module.exports = router
