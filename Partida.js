'use strict'


const util = require('util')
const Tablero = require('./Tablero.js')
const MonteCarlo = require('./Montecarlo.js')


let partida = new Tablero(4) //partida.jugar()
let mcts = new MonteCarlo(partida)
let estado = partida.estadoInicial()

let jugador  = estado.turno
let ganador = partida.hayGanador(estado)

while (ganador === null){
	let tirada = Math.floor(Math.random() * 6) + 1
	
	estado.turno = jugador
	
	console.log()
	console.log("Jugador: " + jugador + " tirada: " + tirada)

	if (jugador === 3) { // Juega la IA por el jugador 3
		tirada = 5 // TODO: Borrar es solo para probar
		mcts.busqueda(estado, tirada)

		for(let hijo of mcts.nodos.values()){
			console.log("Ganamos?" + hijo.jugada)
		}

		let jugada = mcts.mejorJugada(estado, "victorias")
		if (jugada !== undefined){
			console.log("Jugada elegida: " + util.inspect(jugada, {showHidden: false, depth: null}))
			estado = partida.siguienteEstado(estado, jugada)
		}
	}
	else{
		console.log()
		console.log("Seleccione una de las posibles jugadas: ")
		
		let jugadasLegales = partida.jugadasLegales(estado)

		// TODO: Si hay movimientos poder elegir; ahora solo coge la primera
		if (jugadasLegales.length > 0){
			let jugada = jugadasLegales[0]
			estado = partida.siguienteEstado(estado, jugada)
		}
	}

	ganador = partida.hayGanador(estado)

	partida.mostrar()
	partida.mostrarJug()
	partida.mostrarPos()
	partida.mostrarMeta()

	jugador = (jugador + 1) % partida.MAX
}

console.log()
console.log("Ganador: " + ganador)