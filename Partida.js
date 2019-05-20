'use strict'


const util = require('util')
const Tablero = require('./Tablero.js')
const MonteCarlo = require('./Montecarlo.js')


let partida = new Tablero(4) //partida.jugar()
let mcts = new MonteCarlo(partida)
let estado = partida.estadoInicial()

let ganador = partida.hayGanador(estado)

while (ganador === null){
	let tirada = Math.floor(Math.random() * 6) + 1
	let jugador  = estado.turno
	
	console.log()
	console.log("Jugador: " + jugador + " tirada: " + tirada)

	if (jugador === 3) { // Juega la IA por el jugador 3
		//tirada = 5
		mcts.busqueda(estado, tirada)

		let jugada = mcts.mejorJugada(estado, "victorias")

		if (jugada !== undefined){
			console.log("Jugada elegida: " + util.inspect(jugada, {showHidden: false, depth: null}))
			estado = partida.siguienteEstado(estado, jugada)
		}
	}
	else{
		console.log()
		console.log("Seleccione una de las posibles jugadas: ")
		
		let jugadasLegales = partida.jugadasLegales(estado, tirada)

		// TODO: Si hay movimientos poder elegir; coge uno aleatorio
		if (jugadasLegales.length > 0){
			let jugada = jugadasLegales[Math.floor(Math.random() * jugadasLegales.length)]
			estado = partida.siguienteEstado(estado, jugada)
		}
	}

	ganador = partida.hayGanador(estado)

	partida.mostrar()
	partida.mostrarJug()
	partida.mostrarPos()
	partida.mostrarMeta()
}

console.log()
console.log("Ganador: " + ganador)