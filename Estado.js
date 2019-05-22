class Estado{
    constructor(pos, casa, meta, casilla, jugadores, turno, historial){
			this.pos = pos
			this.casa = casa
			this.meta = meta
			this.casilla = casilla
			this.jugadores = jugadores
			this.turno = turno // Indica turno del jugador
			this.historial = historial // Historial de movimientos
	}

	pos(){ return this.pos }

	casa(){ return this.casa }

	meta(){ return this.meta }

	turno(){ return this.turno }

	historial(){ return this.historial }

	esJugador(jugador) {
		return (jugador === this.turno)
	}
	
	hash() {
		return JSON.stringify(this.historial)
	}
}

module.exports = Estado