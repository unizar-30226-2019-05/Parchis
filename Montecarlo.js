class MonteCarlo {
    constructor(partida){
        //this.dadosTirada = dados
        this.nodos = new Map()
        this.partida  = partida
    }

    crearNodo(estado){
        if(!this.nodos.has(estado.hash())){
            let jugadasInexploradas = this.game.jugadsaLegales(estado).slice()
            let nodo = new NodoMontecarlo(null, null, estado, jugadasInexploradas)
            this.nodos.set(estado.hash(), nodos)
        }
    }

    // Crea el arbol de exploracion del estado actual para
    // el turno de un jugador
    busqueda(estado, tirada, timeoutSec = 5){
        this.crearNodo(estado)

        // let victorias = 0  TODO: Draws?
        let simulacionesTotales = 0
            
        let maxTiempoSimulacion = Date.now() + timeoutSec * 1000
        
        // Busca timeout milisegundos 
        while (Date.now() < maxTiempoSimulacion) {
            let nodo = this.seleccion(state)
            let hayGanador, ganador
            [hayGanador, ganador] = this.partida.hayGanador()

            // Se acaba la etapa de selección
            if (nodo.esHoja() === false && ganador === null){
                nodo = this.expandir(nodo)
                ganador = this.simular(nodo)
            }           
            this.retropropagar(nodo, ganador);

            // if (ganador === 0) draws++ TODO REVISAR
            simulacionesTotales++;
        }
    }

    // Elige la mejor jugada desde el estado actual
    mejorJugada(estado, politica = "robustez"){
        this.crearNodo(estado)

        if (this.nodos.get(estado.hash()).expandidoTotalmente() === false)
            throw new Error("No se han expandido todos sus hijos!, falta info")
        
        let nodo = this.nodos.get(estado.hash())
        let jugadasPosibles = nodo.jugadasPosibles()
        let mejorJugada

        // Más visitados: Nodo que ha aparecido en más simulaciones
        if (politica === "robustez"){
            let max = -Infinity
            for (let jugada of jugadasPosibles){
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

    // Funciones principales: seleccionar, expanir, simular, retropropagar
    seleccionar(estado){
        let nodo = this.nodos.get(state.hash())
        while(nodo.e() && !nodo.esHoja()) {
            let jugadas = nodo.jugadasPosibles()
            let mejorJugada
            let mejorUCB = -Infinity
            for (let jugada of jugadas) {
                let hijoUCB = nodo.nodoHijo(jugada).UCB(this.UCBParam)
                if (hijoUCB > mejorUCB) {
                    mejorJugada = jugada
                    mejorUCB = hijoUCB
                }
            }
            nodo = nodo.nodoHijo(mejorJuagada)
        }
        return nodo
    }

    expandir(nodo){
        let jugadas = nodo.jugadasInexploradas()
        let indice = Math.floor(Math.random() * jugadas.length)
        let jugada = jugadas[indice]

        let estadoHijo = this.partida.siguienteEstado(nodo.estado, jugada)
        let hijosJugadasInexploradas = this.game.jugadasLegales(estadoHijo)
        let nodoHijo = nodo.expand(jugada, estadoHijo, hijosJugadasInexploradas)
        this.nodes.set(childState.hash(), childNode)

        return nodoHijo
    }

    simular(nodo){
        let esado = node.estado
        let ganador = this.partida.ganador(estado)

        while (ganador === null) {
            let jugadas = this.partida.jugadasLegales(estado)
            let jugada = jugadas[Math.floor(Math.random() * jugadas.length)]
            estado = this.partida.siguienteEstado(estado, jugada)
            ganador = this.partida.ganador(estado)
        }

        return ganador
    }

    retropropagar(nodo, ganador){
        while (nodo !== null){
            nodo.numJugadasSimulacion += 1;
            if (nodo.estado.esJugador(ganador)) {
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
                                            n_jugadas: hijo.node.n_plays, 
                                            n_victorias: hijo.node.n_wins})
        }

        return estadisticas
    }
}