'use strict'


const util = require('util')
const clonedeep = require('lodash.clonedeep')
const Montecarlo = require('./Montecarlo.js')
const Estado = require('./Estado.js')

class IAMontecarlo{
	constructor(t, parejas=false){
		this.tiempoJugada = t
		this.parejas = parejas
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
		
		//if(mcts.partida.jugadasLegales(estadoPartida, tirada).length !== 0){
			mcts.busqueda(estadoBusqueda, tirada, this.tiempoJugada) // deberia estar this.tiempoJugada PROBAR DIFERENTES TIEMPOS
			let jugada = mcts.mejorJugada(estadoPartida, tirada, "robustez")
			if (jugada !== undefined){
				console.log("Mejor jugada elegida: " + util.inspect(jugada, {showHidden: false, depth: null}))
				let estadisticas = mcts.estadisticas(estadoPartida)
				console.log(util.inspect(estadisticas, {showHidden: false, depth: null}))

				if (estadoPartida === undefined) throw new Error

				let turno = estadoPartida.turno
				let ficha = jugada.ficha

				let prevEstado = estadoPartida.casa[turno][ficha]
				let siguienteEstado = partidaMontecarlo.siguienteEstado(estadoPartida, jugada) // Se mueve
				let actEstado = siguienteEstado.casa[turno][ficha]

				this.actualizarTableroPartidaNormal(partidaNormal, siguienteEstado)

				let pos = siguienteEstado.pos[turno][ficha]
				let accion = siguienteEstado.repeticion

				let estado

				if(prevEstado === "CASA" && actEstado === "FUERA"){
					estado = "FUERA"
				}
				else if(prevEstado === "FUERA" && actEstado === "META"){
					estado = "ENTRA"
				}
				else if(prevEstado === "META" && actEstado === "META"){
					estado = "META"
				}
				else if(accion === "mete"){
					estado = "METIDA"
				}
				else{
					estado = "FUERA"
				}
				console.log("El estado es " + estado)
				console.log("La accion: " + accion)
				console.log("Posisiones")
				for(let i = 0; i < partidaNormal.MAX; i++){
					for(let j = 0; j < partidaNormal.MAX; j++){
						console.log("Jugador " + i + " casa " + j + " " + partidaNormal.casa[i][j])
					}
				}


				let devolver = {ficha: ficha, pos: pos, accion: accion, estado: estado}
				
				return devolver
			}
		//}
		else{
			
			console.log("No existe ninguna jugada posible para la tirada")
			if (tirada !== 6){
				estadoPartida.turno = (estadoPartida.turno + 1) % partidaNormal.MAX
				partidaNormal.pasarTurno()
				this.actualizarTableroPartidaNormal(partidaNormal, estadoPartida)
			}
			else{
				if (estadoPartida.tripleSeis !== 2){
					estadoPartida.tripleSeis++
					partidaNormal.pasarTurno()
					this.actualizarTableroPartidaNormal(partidaNormal, estadoPartida)
				}
				else{
					estadoPartida.tripleSeis = 0

					if(estadoPartida.pos[estadoPartida.turno][estadoPartida.lastMove] == 0){
						estadoPartida.casilla[partidaNormal.numFichas - 1].sacar(estadoPartida.player[estadoPartida.turno].gcolor());
					}
					else{
						estadoPartida.casilla[estadoPartida.pos[estadoPartida.turno][estadoPartida.lastMove]-1].sacar(estadoPartida.player[i].gcolor());
					}
					estadoPartida.casa[estadoPartida.turno][estadoPartida.lastMove] = "CASA"
					estadoPartida.player[estadoPartida.turno].muerta()

					partidaNormal.pasarTurno()
					estadoPartida.turno = (estadoPartida.turno + 1) % partidaNormal.MAX
					
					this.actualizarTableroPartidaNormal(partidaNormal, estadoPartida)

					let devolver = {ficha: estadoPartida.ultimaFicha, pos: estadoPartida.pos[estadoPartida.turno][estadoPartida.ultimaFicha], accion: "triple", color: estadoPartida.jugadores[estadoPartida.turno].gcolor()}
					
					return devolver
				}
			}

			return null
		}
	}
}

module.exports = IAMontecarlo