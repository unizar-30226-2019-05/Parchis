'use strict'


const util = require('util')
const clonedeep = require('lodash.clonedeep')
const Montecarlo = require('./Montecarlo.js')
const Estado = require('./Estado.js')

class IAMontecarlo{
	constructor(t, parejas){
		this.tiempoJugada = t
	}

	// Devuelve un tablero montecarlo para poder 'machacarlo' y el estado actual de la partida
	copiarTableroNormalATableroMontecarlo(partidaNormal, partidaMontecarlo){
		partidaMontecarlo.pos = clonedeep(partidaNormal.pos)
		partidaMontecarlo.casa = clonedeep(partidaNormal.casa)
		partidaMontecarlo.casilla = clonedeep(partidaNormal.casilla)
		partidaMontecarlo.meta = clonedeep(partidaNormal.meta)
		partidaMontecarlo.player = clonedeep(partidaNormal.player)
		partidaMontecarlo.turno = partidaNormal.turno
		partidaMontecarlo.repeticion = partidaNormal.matadoMetidoAntes
		partidaMontecarlo.ultimaFicha = partidaNormal.lastMove

		if(partidaMontecarlo.player === undefined) throw new Error

		let estadoActual = new Estado(clonedeep(partidaMontecarlo.pos), clonedeep(partidaMontecarlo.casa), clonedeep(partidaMontecarlo.meta), clonedeep(partidaMontecarlo.casilla), clonedeep(partidaMontecarlo.player), partidaMontecarlo.turno, partidaNormal.historialGlobalPartida.slice(), partidaMontecarlo.matadoMetidoAntes, partidaNormal.veces6, partidaMontecarlo.lastMove) // TODO historial
		
		return estadoActual
	}

	actualizarTableroPartidaNormal(partidaNormal, estadoActual){
		partidaNormal.pos = clonedeep(estadoActual.pos)
		partidaNormal.casa = clonedeep(estadoActual.casa)
		partidaNormal.casilla = clonedeep(estadoActual.casilla)
		partidaNormal.meta = clonedeep(estadoActual.meta)
		partidaNormal.player = clonedeep(estadoActual.jugadores)
		partidaNormal.veces6 = estadoActual.tripleSeis
		partidaNormal.lastMove = estadoActual.ultimaFicha
		partidaNormal.turno = estadoActual.turno
		partidaNormal.matadoMetidoAntes = estadoActual.repeticion
		partidaNormal.historialGlobalPartida = estadoActual.historial.slice()
	}

	tirar(tirada, partidaNormal, partidaMontecarlo){
		let estadoPartida = this.copiarTableroNormalATableroMontecarlo(partidaNormal, partidaMontecarlo)
		let mcts = new Montecarlo(partidaMontecarlo, partidaMontecarlo.porParejas)
		
		let estadoBusqueda = clonedeep(estadoPartida)
		mcts.busqueda(estadoBusqueda, tirada, 3) // deberia estar this.tiempoJugada PROBAR DIFERENTES TIEMPOS
		let jugada = mcts.mejorJugada(estadoPartida, tirada, "robustez")
		if (jugada !== undefined){
			console.log("Mejor jugada elegida: " + util.inspect(jugada, {showHidden: false, depth: null}))
			let estadisticas = mcts.estadisticas(estadoPartida)
			console.log(util.inspect(estadisticas, {showHidden: false, depth: null}))

			if (estadoPartida === undefined) throw new Error

			let turno = estadoPartida.turno
			let ficha = jugada.ficha

			let siguienteEstado = partidaMontecarlo.siguienteEstado(estadoPartida, jugada) // Se mueve


			this.actualizarTableroPartidaNormal(partidaNormal, siguienteEstado)

			let pos = siguienteEstado.pos[turno][ficha]
			let estado = siguienteEstado.casa[turno][ficha]
			let accion = siguienteEstado.repeticion

			let devolver = {ficha: ficha, pos: pos, accion: accion, estado: estado}
			console.log("Accion: " + accion)
			return devolver
		}
		else{
			partidaNormal.pasarTurno()
			console.log("No existe ninguna jugada posible para la tirada")
			if (tirada !== 6){
				estadoPartida.turno = (estadoPartida.turno + 1) % partidaNormal.MAX
			}
			else{
				if (estadoPartida.tripleSeis !== 2){
					estadoPartida.tripleSeis++
				}
				else{
					estadoPartida.tripleSeis = 0
					estadoPartida.turno = (estadoPartida.turno + 1) % partidaNormal.MAX
				}
			}

			this.actualizarTableroPartidaNormal(partidaNormal, estadoPartida)

			return null
		}
	}
}

module.exports = IAMontecarlo