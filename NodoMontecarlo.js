/** Class representing a node in the search tree. */
class NodoMontecarlo {
    constructor(padre, jugada, estadoActual, restoJugadas) {
      this.jugada = jugada
      this.estado = estadoActual

      // Monte Carlo stuff
      this.jugadasFinales = 0
      this.victorias = 0

      // Tree stuff
      this.padre = padre
      this.hijo = new Map()
      for (let jugada of restoJugadas) {
        this.children.set(play.hash(), { jugada: jugada, node: null })
      }

      nodoHijo(){
        return this.hijo;
      }

}