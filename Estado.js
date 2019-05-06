class Estado{
    constructor(pos, casa, meta, jugador, historial){
			this.pos = pos
			this.casa = casa
			this.meta = meta
			this.jugador = jugador // Indica turno del jugador
			this.historial = historial // Historial de movimientos
	}

	pos(){ return this.pos }

	casa(){ return this.casa }

	meta(){ return this.meta }

	jugador(){ return this.jugador }

	historial(){ return this.historial }

	esJugador(jugador) {
		return (jugador === this.jugador)
	}
	
	hash() {
		return JSON.stringify(this.historial)
	}
}