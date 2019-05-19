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
    busqueda(estado, tirada, timeoutSec = 5){
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
        let nodo = this.nodos.get(estado.hash())

        while(nodo.expandidoTotalmente() && !nodo.esHoja()) {
            let jugadas = nodo.jugadasPosibles()
            let mejorJugada
            let mejorUCB = -Infinity
            for (let jugada of jugadas) {
                console.log("Ahre " + jugada.hash())
                console.log("Tamanyo: " + this.nodos.size)
                for (let j of this.nodos.values()){
                    console.log("XD: " + jugada.hash())
                }
                let hijoUCB = nodo.nodoHijo(jugada).UCB(this.UCBParam)
                console.log("valor " + hijoUCB)
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
            let pos = estado.pos;
            let casa = estado.casa;
            let meta = estado.meta;
            for(let i=0;i<4;i++){
                console.log("Player: "+ i + "origen: " + i*17 + " ---1: "+ pos[i][0]+ " 2: "+ pos[i][1]+" 3: "+ pos[i][2]+ " 4: "+ pos[i][3])
                console.log("Casa: " + casa[i][0] + "---" + casa[i][1] + "---" + casa[i][2] + "---" + casa[i][3])
                console.log("Meta: ")
                for (let j = 0; j < 8; j++){
                    console.log("Pos1 " + meta[i][j].pos1 + " " + "Pos2 " + meta[i][j].pos2);
                }
            }
            estado = this.partida.siguienteEstado(estado, jugada)
            ganador = this.partida.hayGanador(estado)
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
                                            n_jugadas: hijo.nodo.numJugadasSimulacion, 
                                            n_victorias: hijo.nodo.numVictoriasSimulacion})
        }

        return estadisticas
    }
}

module.exports = MonteCarlo