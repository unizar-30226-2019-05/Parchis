class Jugada {
    constructor(jugador, ficha, tirada){
        this.jugador = jugador
        this.ficha = ficha
        this.tirada = tirada
    }

    jugador(){ return this.jugador }

    ficha(){ return this.ficha }

    tirada(){ return this.tirada }

    hash(){
        return "(" + this.jugador.toString() + "," + this.ficha.toString() + "," + this.tirada.toString() + ")"
    }
}