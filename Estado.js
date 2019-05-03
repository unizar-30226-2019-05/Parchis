class Estado{
    constructor(pos, casa, meta, turno, historial){
			this.pos = pos
			this.casa = casa
			this.meta = meta
			this.turno = turno
			this.historial = historial
	}
	
	hash() {
		return JSON.stringify(this.historial)
	}
}