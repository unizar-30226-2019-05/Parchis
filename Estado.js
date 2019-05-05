class Estado{
    constructor(pos, casa, meta, jugador, historial){
			this.pos = pos
			this.casa = casa
			this.meta = meta
			this.jugador = jugador // Indica turno del jugador
			this.historial = historial // Historial de movimientos
	}

	esJugador(jugador) {
		return (jugador === this.jugador)
	}
	
	hash() {
		return JSON.stringify(this.historial)
	}
}