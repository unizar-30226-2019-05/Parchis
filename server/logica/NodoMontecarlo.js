/** Class representing a node in the search tree. */
class NodoMontecarlo {
    constructor(padre, jugada, estadoActual, jugadasInexploradas) {
        this.jugada = jugada
        this.estado = estadoActual

        this.numJugadasSimulacion = 0
        this.numVictoriasSimulacion = 0

        this.padre = padre
        this.hijos = new Map()
        for (let jugada of jugadasInexploradas) {
            this.hijos.set(jugada.hash(), { jugada: jugada, nodo: null })
        }
    }
    // Nodo hijo tras la jugada
    nodoHijo(jugada){
        //console.log("Jugadas totales: " + this.hijos.size)
        let hijo = this.hijos.get(jugada.hash())
        //console.log("CONTROL " + hijo.jugada.hash())
        if (hijo === undefined){
            throw new Error ("No es posible la jugada")
        }
        else if (hijo.nodo === null){
            throw new Error ("El hijo no ha sido expandido")
        }

        return hijo.nodo;
    }

    expandir(jugada, estadoHijo, jugadasInexploradas){
        if (!this.hijos.has(jugada.hash())) throw new Error ("No es posible la jugada")
        let nodoHijo = new NodoMontecarlo(this, jugada, estadoHijo, jugadasInexploradas)
        this.hijos.set(jugada.hash(), { jugada: jugada, nodo: nodoHijo })
        return nodoHijo
    }

    jugadasPosibles(){
        let jugadas = []
        for (let hijo of this.hijos.values()){
            jugadas.push(hijo.jugada)
        }
        
        return jugadas
    }

    jugadasInexploradas(){
        let jugadas = []
        for (let hijo of this.hijos.values()){
            if (hijo.nodo === null) jugadas.push(hijo.jugada)
        }
        return jugadas
    }

    // Devuelve se han expandido todos sus hijos
    expandidoTotalmente(){
        for (let hijo of this.hijos.values()){
            if(hijo.nodo === null) return false
        }

        return true
    }    
        
    esHoja(){
        if (this.hijos.size === 0) return true
        else return false
    }

    // UCB = w/t + c*sqrt(s(n)/s(t))
    UCB(c){
        //console.log("Victorias simulacion: " + this.numVictoriasSimulacion + "jugadas finales " + this.numJugadasSimulacion + "jugadas padre " + this.padre.numJugadasSimulacion + " jugadas simuladas " + this.numJugadasSimulacion)
        return (this.numVictoriasSimulacion / this.numJugadasSimulacion) + c * Math.sqrt(Math.log(this.padre.numJugadasSimulacion) / this.numJugadasSimulacion)
    }
}

module.exports = NodoMontecarlo