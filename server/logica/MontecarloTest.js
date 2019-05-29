'use strict'


const util = require('util')
const TableroMontecarlo = require('./TableroMontecarlo.js')
const MonteCarlo = require('./Montecarlo.js')
const clonedeep = require('lodash.clonedeep')

let partida = new TableroMontecarlo(4) //partida.jugar()
let mcts = new MonteCarlo(partida)
let estado = partida.estadoInicial()

let ganador = partida.hayGanador(estado)

while (ganador === null){
	let tirada = Math.floor(Math.random() * 6) + 1
	// estado.turno = 0
	// tirada = 1
	let jugador  = estado.turno

	console.log()
	console.log("Jugador: " + jugador + " tirada: " + tirada)
	
	if (jugador === 0){ // Juega la IA por el jugador 0
		let estadoBusqueda = clonedeep(estado)

		mcts.busqueda(estadoBusqueda, tirada, 8) // PROBAR DIFERENTES TIEMPOS
		
		let jugada = mcts.mejorJugada(estado, tirada, "robustez")

		if (jugada !== undefined){
			console.log("Mejor jugada elegida: " + util.inspect(jugada, {showHidden: false, depth: null}))
			
			estado = partida.siguienteEstado(estado, jugada)
		}
		else{ // Pasar al siguiente jugador
			console.log("No tiene ninguna jugada posible para la tirada")
			estado.turno = (jugador + 1) % partida.MAX;
		}
	}
	else{ // 3 jugadores normales con movimientos aleatorios
		
		let jugadasLegales = partida.jugadasLegales(estado, tirada)

		// TODO: Si hay movimientos se puede elegir; coge uno aleatorio
		if (jugadasLegales.length > 0){
			let jugada = jugadasLegales[Math.floor(Math.random() * jugadasLegales.length)]
			console.log("Jugada aleatoria: " + util.inspect(jugada, {showHidden: false, depth: null}))

			estado = partida.siguienteEstado(estado, jugada)
			if (estado.repeticion !== null){
				console.log("FIJARSE AQUI")
			}
		}
		else{ // Pasar al siguiente jugador
			console.log("No tiene ninguna jugada posible para la tirada")
			estado.turno = (jugador + 1) % partida.MAX;
		}
	}

	ganador = partida.hayGanador(estado)

	//partida.mostrar()
	console.log("---- ESTADO TRAS JUGADA ----")
	partida.mostrarJug(estado)
	partida.mostrarPos(estado)
	partida.mostrarMeta(estado)
}

console.log()
console.log("Ganador: " + ganador)