'use strict'

	const util = require('util')
	const Tablero = require('./Tablero.js')
	const MonteCarlo = require('./Montecarlo.js')


	let partida = new Tablero(4) //partida.jugar()
	let mcts = new MonteCarlo(partida)
	let estado = partida.estadoInicial()

	let jugador  = estado.jugador()
	let hayGanador, ganador

	partida.hayGanador(estado) = [hayGanador, ganador] 

	while (!hayGanador){
		let tirada = Math.floor(Math.random() * 6) + 1
		
		estado.tirada = tirada
		estado.jugador = jugador
		let jugadasLegales = jugadasLegales(estado)

		console.log()
		console.log("Jugador: " + (jugador))

		if(jugador === 3) { // Juega la IA por el jugador 3
			mcts.busqueda(estado)

			let jugada = mcts.mejorJugada(estado, "robustez")
			conconsole.log("Jugada elegida: " + util.inspect(jugada, {showHidden: false, depth: null}))

			estado = partida.siguienteEstado(estado, jugada)
		}
		else{
			console.log()
			console.log("Seleccione una de las posibles jugadas: ")
			// TODO: Ahora solo va a coger la primera de las que tiene
			let jugada = jugadasLegales[0]
			estado = partida.siguienteEstado(estado, jugada)
		}

		partida.hayGanador(estado) = [hayGanador, ganador]
		partida.mostrar()
		partida.mostrarJug()
		partida.mostrarPos()
		partida.mostrarMeta()

		jugador = (jugador + 1) % MAX
	}
	
	console.log()
	console.log("Ganador: " + ganador)