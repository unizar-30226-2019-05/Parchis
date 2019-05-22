'use strict'


const util = require('util')
const Tablero = require('./Tablero.js')
const MonteCarlo = require('./Montecarlo.js')
const clonedeep = require('lodash.clonedeep')

let partida = new Tablero(4) //partida.jugar()
let mcts = new MonteCarlo(partida)
let estado = partida.estadoInicial()

let ganador = partida.hayGanador(estado)

while (ganador === null){
	let tirada = Math.floor(Math.random() * 6) + 1
	estado.turno = 3
	tirada = 5
	let jugador  = estado.turno

	console.log()
	console.log("Jugador: " + jugador + " tirada: " + tirada)
	
	if (jugador === 3) { // Juega la IA por el jugador 3
		let estadoBusqueda = clonedeep(estado)
		
		for(let i=0;i<4;i++){
			console.log("Player: "+ i + "origen: " + i*17 + " ---1: "+ estado.pos[i][0]+ " 2: "+ estado.pos[i][1]+" 3: "+ estado.pos[i][2]+ " 4: "+ estado.pos[i][3])
			console.log("Casa: " + estado.casa[i][0] + "---" + estado.casa[i][1] + "---" + estado.casa[i][2] + "---" + estado.casa[i][3])
		}

		mcts.busqueda(estadoBusqueda, tirada)
		
		let jugada = mcts.mejorJugada(estado, "robustez")

		console.log("\n\n\n ---INICIO---")
		for(let i=0;i<4;i++){
			console.log("Player: "+ i + "origen: " + i*17 + " ---1: "+ estado.pos[i][0]+ " 2: "+ estado.pos[i][1]+" 3: "+ estado.pos[i][2]+ " 4: "+ estado.pos[i][3])
			console.log("Casa: " + estado.casa[i][0] + "---" + estado.casa[i][1] + "---" + estado.casa[i][2] + "---" + estado.casa[i][3])
		}

		if (jugada !== undefined){
			console.log("Mejor jugada: " + jugada.hash())
			console.log("Jugada elegida: " + util.inspect(jugada, {showHidden: false, depth: null}))
			for(let i=0;i<4;i++){
				console.log("Player: "+ i + "origen: " + i*17 + " ---1: "+ estado.pos[i][0]+ " 2: "+ estado.pos[i][1]+" 3: "+ estado.pos[i][2]+ " 4: "+ estado.pos[i][3])
				console.log("Casa: " + estado.casa[i][0] + "---" + estado.casa[i][1] + "---" + estado.casa[i][2] + "---" + estado.casa[i][3])
			}
			estado = partida.siguienteEstado(estado, jugada)
			

			console.log("\n\n\n ---FIN---")
			for(let i=0;i<4;i++){
				console.log("Player: "+ i + "origen: " + i*17 + " ---1: "+ estado.pos[i][0]+ " 2: "+ estado.pos[i][1]+" 3: "+ estado.pos[i][2]+ " 4: "+ estado.pos[i][3])
				console.log("Casa: " + estado.casa[i][0] + "---" + estado.casa[i][1] + "---" + estado.casa[i][2] + "---" + estado.casa[i][3])
			}
		}
		else{ // Pasar al siguiente jugador
			estado.turno = (jugador + 1) % partida.MAX;
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
		else{ // Pasar al siguiente jugador
			estado.turno = (jugador + 1) % partida.MAX;
		}
	}

	ganador = partida.hayGanador(estado)

	//partida.mostrar()
	partida.mostrarJug()
	partida.mostrarPos()
	partida.mostrarMeta()
}

console.log()
console.log("Ganador: " + ganador)