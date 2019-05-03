class Partida{
	constructor(){
		let partida = new Tablero(4,1) //partida.jugar()
		let mcts = new MonteCarlo(partida)

		let estado = partida.estadoInicial()
		let hayGanador, ganador

		partida.hayGanador() = [hayGanador, ganador] 

		while (!hayGanador){
			console.log()
			console.log("Jugador: " + (estado.jugador))

			mcts.runSearch(estado)

			let jugada = mcts.mejorJugada(estado, "robustez")
			conconsole.log("Jugada elegida: " + util.inspect(jugada, {showHidden: false, depth: null}))

			estado = partida.siguienteEstado(estado, jugada)
			partida.hayGanador() = [hayGanador, ganador]
		}

		console.log()
		console.log("Ganador: " + ganador)
	}
}