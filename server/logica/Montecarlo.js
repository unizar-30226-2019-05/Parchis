const NodoMontecarlo = require('./NodoMontecarlo.js')

class MonteCarlo {
    constructor(partida, parejas){
        this.partida = partida
        this.parejas = parejas
        this.UCBParam = Math.sqrt(2)
        this.nodos = new Map()
    }

    crearNodo(estado, tirada){
        if(!this.nodos.has(estado.hash())){
            let jugadasInexploradas = this.partida.jugadasLegales(estado, tirada).slice()
            let nodo = new NodoMontecarlo(null, null, estado, jugadasInexploradas)
            this.nodos.set(estado.hash(), nodo)
        }
    }

    // Crea el arbol de exploracion del estado actual para
    // el turno de un jugador
    busqueda(estado, tirada, timeoutSec = 3){
        this.crearNodo(estado, tirada)

        // let victorias = 0  TODO: Draws?
        let simulacionesTotales = 0
            
        let maxTiempoSimulacion = Date.now() + timeoutSec * 1000
        
        // Busca timeout milisegundos 
        while (Date.now() < maxTiempoSimulacion) {
            let nodo = this.seleccionar(estado)
            if(nodo.jugadasPosibles().length === 0){break}

            
            let ganadores = this.partida.hayGanador(estado)
            let ganador1 = ganadores[0]
            let ganador2 = ganadores[1]

            // Se acaba la etapa de selección
            if (nodo.esHoja() === false && ((ganador1 === null) || (this.parejas && ganador2 === null))){
                nodo = this.expandir(nodo, tirada)
                ganadores = this.simular(nodo)
                ganador1 = ganadores[0]
                ganador2 = ganadores[1]
            }
            this.retropropagar(nodo, ganador1, ganador2);

            // if (ganador === 0) draws++ TODO REVISAR
            simulacionesTotales++;
        }

        return { tiempoEjecucion: timeoutSec, simulaciones: simulacionesTotales }
    }

    // Elige la mejor jugada desde el estado actual
    mejorJugada(estado, tirada, politica = "robustez"){
        this.crearNodo(estado, tirada)

        if (this.nodos.get(estado.hash()).expandidoTotalmente() === false)
            throw new Error("No se han expandido todos sus hijos!, falta info")
        
        let nodo = this.nodos.get(estado.hash())
        let jugadasPosibles = nodo.jugadasPosibles()
        let mejorJugada
        console.log("Numero de jugadas " + jugadasPosibles.length)
        let imprimirJugadas = ""
        for (let jugada of jugadasPosibles){
            imprimirJugadas += jugada.hash() + " "
        }
        console.log(imprimirJugadas)

        // Más visitados: Nodo que ha aparecido en más simulaciones
        if (politica === "robustez"){
            let max = -Infinity
            for (let jugada of jugadasPosibles){
                //console.log("Mejor jugadaXD: " + jugada.hash())
                let nodoHijo = nodo.nodoHijo(jugada)
                if (nodoHijo.numJugadasSimulacion > max){
                    mejorJugada = jugada
                    max = nodoHijo.numJugadasSimulacion
                }
            }    
        }    
        // Mayor winrate: Nodo con mayor porcentaje de victorias
        else if (politica === "victorias"){
            let max = -Infinity
            for (let jugada of jugadasPosibles){
                let nodoHijo = nodo.nodoHijo(jugada)
                if (nodoHijo.numVictoriasSimulacion / nodoHijo.numJugadasSimulacion > max){
                    mejorJugada = jugada
                    max = nodoHijo.numJugadasSimulacion
                }
            }
        }
        return mejorJugada
    }

    seleccionar(estado){
        let nodo = this.nodos.get(estado.hash())

        while(nodo.expandidoTotalmente() && !nodo.esHoja()) {
            let jugadas = nodo.jugadasPosibles()
            let mejorJugada
            let mejorUCB = -Infinity
            for (let jugada of jugadas) {
                let prueba = nodo.nodoHijo(jugada)
                let hijoUCB = nodo.nodoHijo(jugada).UCB(this.UCBParam)

                if (hijoUCB > mejorUCB) {
                    mejorJugada = jugada
                    mejorUCB = hijoUCB
                }
            }
            nodo = nodo.nodoHijo(mejorJugada)
        }
        return nodo
    }

    expandir(nodo){
        let jugadas = nodo.jugadasInexploradas()
        let indice = Math.floor(Math.random() * jugadas.length)
        let jugada = jugadas[indice]
        
        let estadoHijo = this.partida.siguienteEstado(nodo.estado, jugada)
        let hijosJugadasInexploradas = this.partida.jugadasLegalesTodasTiradas(estadoHijo) // TODO: Todos los dados posibles?
        let nodoHijo = nodo.expandir(jugada, estadoHijo, hijosJugadasInexploradas)
        this.nodos.set(estadoHijo.hash(), nodoHijo)

        return nodoHijo
    }

    simular(nodo){
        let estado = nodo.estado
        let ganadores = this.partida.hayGanador(estado)
        let ganador1 = ganadores[0]
        let ganador2 = ganadores[1]

        while ((ganador1 === null) || (this.parejas && ganador2 === null)) {
            let jugadas = this.partida.jugadasLegalesTodasTiradas(estado) // TODO: Todos los dados posibles?
            let jugada = jugadas[Math.floor(Math.random() * jugadas.length)]
            
            if (jugadas.length > 0){
                estado = this.partida.siguienteEstado(estado, jugada)
            }
            else{
                // this.partida.mostrarPos(estado)
                // this.partida.mostrarMeta(estado)
                // console.log(estado.turno)
                // //throw new Error
                estado.turno = (estado.turno + 1) % this.partida.MAX
            }
            
            ganadores = this.partida.hayGanador(estado)
            ganador1 = ganadores[0]
            ganador2 = ganadores[1]
        }
        console.log("AQUI")

        return [ganador1, ganador2]
    }

    retropropagar(nodo, ganador1, ganador2){
        while (nodo !== null){
            nodo.numJugadasSimulacion += 1;
            if (nodo.estado.esJugador(-ganador1)) {
                nodo.numVictoriasSimulacion += 1
            }
            
            if(this.parejas && nodo.estado.esJugador(-ganador2)){
                nodo.numVictoriasSimulacion += 1
            }

            nodo = nodo.padre
        }
    }

    estadisticas(estado){
        let nodo = this.nodos.get(estado.hash())
        let estadisticas = {    n_jugadas: nodo.numJugadasSimulacion, 
                                n_victorias: nodo.numVictoriasSimulacion, 
                                hijos: [] }
        
        for (let hijo of nodo.hijos.values()) {
            if (hijo.nodo === null) 
                estadisticas.hijos.push({   jugada: hijo.jugada, 
                                            n_jugadas: null, 
                                            n_victorias: null})
            else 
                estadisticas.hijos.push({   jugada: hijo.jugada, 
                                            n_jugadas: hijo.nodo.numJugadasSimulacion, 
                                            n_victorias: hijo.nodo.numVictoriasSimulacion})
        }

        return estadisticas
    }
}

module.exports = MonteCarlo