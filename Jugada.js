class Jugada {
    constructor(ficha, tirada){
        this.ficha = ficha
        this.tirada = tirada
    }

    hash(){
        return "(" + this.ficha.toString() + "," + this.tirada.toString() + ")"
    }
}

module.exports = Jugada