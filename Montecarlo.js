const NodoMontecarlo = require('./NodoMontecarlo.js')

class MonteCarlo {
    constructor(partida){
        this.partida  = partida
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
            let ganador = this.partida.hayGanador(estado)

            // Se acaba la etapa de selección
            if (nodo.esHoja() === false && ganador === null){
                nodo = this.expandir(nodo, tirada)
                ganador = this.simular(nodo)
            }           
            this.retropropagar(nodo, ganador);

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

        // Más visitados: Nodo que ha aparecido en más simulaciones
        if (politica === "robustez"){
            let max = -Infinity
            for (let jugada of jugadasPosibles){
                console.log("Mejor jugadaXD: " + jugada.hash())
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
        let ganador = this.partida.hayGanador(estado)

        while (ganador === null) {
            let jugadas = this.partida.jugadasLegalesTodasTiradas(estado) // TODO: Todos los dados posibles?
            let jugada = jugadas[Math.floor(Math.random() * jugadas.length)]
            
            if (jugadas.length > 0){    
                /*console.log(jugadas.length)
                let cadena = ""
                for(jugada of jugadas){
                    cadena += jugada.hash() + " "
                }
                console.log(cadena)
                */
                estado = this.partida.siguienteEstado(estado, jugada)
            }
            else{
                this.partida.mostrarPos(estado)
                this.partida.mostrarMeta(estado)
                console.log(estado.turno)
                //throw new Error
                estado.turno = (estado.turno + 1) % this.partida.MAX
            }
            
            ganador = this.partida.hayGanador(estado)
        }

        return ganador
    }

    retropropagar(nodo, ganador){
        while (nodo !== null){
            nodo.numJugadasSimulacion += 1;
            if (nodo.estado.esJugador(-ganador)) {
                nodo.numVictoriasSimulacion += 1
            }

            nodo = nodo.padre
        }
    }

    estadisticas(estado){
        let nodo = this.nodos.get(state.hash())
        let estadisticas = {    n_jugadas: nodo.numJugadasSimulacion, 
                                n_victorias: nodo.numVictoriasSimulacion, 
                                hijos: [] }
        
        for (let hijo of nodo.hijos.values()) {
            if (hijo.nodo === null) 
                estadisticas.hijos.push({   jugada: hijo.play, 
                                            n_jugadas: null, 
                                            n_victorias: null})
            else 
                estadisticas.hijos.push({   jugada: hijo.play, 
                                            n_jugadas: hijo.nodo.numJugadasSimulacion, 
                                            n_victorias: hijo.nodo.numVictoriasSimulacion})
        }

        return estadisticas
    }
}

module.exports = MonteCarlo