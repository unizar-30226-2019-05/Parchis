/* Generated from Java with JSweet 2.2.0-SNAPSHOT - http://www.jsweet.org */
var proyecto;
(function (proyecto) {
    var Jugador = (function () {
        function Jugador(c, n) {
            if (this.numero === undefined)
                this.numero = 0;
            if (this.casa === undefined)
                this.casa = 0;
            if (this.casa1 === undefined)
                this.casa1 = null;
            if (this.__metidas === undefined)
                this.__metidas = 0;
            if (this.__color === undefined)
                this.__color = null;
            if (this.hayComp === undefined)
                this.hayComp = false;
            if (this.comp === undefined)
                this.comp = null;
            this.numero = n;
            this.casa = 4;
            this.__metidas = 0;
            this.__color = c;
            this.hayComp = false;
        }
        Jugador.prototype.number = function () {
            return this.numero;
        };
        Jugador.prototype.enCasa = function () {
            return this.casa;
        };
        Jugador.prototype.metidas = function () {
            return this.__metidas;
        };
        Jugador.prototype.fin = function () {
            return this.metidas() === 4;
        };
        Jugador.prototype.color = function () {
            return this.__color;
        };
        Jugador.prototype.sacar = function () {
            this.casa--;
        };
        Jugador.prototype.muerta = function () {
            this.casa++;
        };
        Jugador.prototype.meter = function () {
            this.__metidas++;
        };
        Jugador.prototype.anyadirCOmp = function (c) {
            this.comp = c;
            this.hayComp = true;
        };
        Jugador.prototype.esComp = function (c) {
            return this.hayComp && c === this.comp;
        };
        return Jugador;
    }());
    proyecto.Jugador = Jugador;
    Jugador["__class"] = "proyecto.Jugador";
})(proyecto || (proyecto = {}));
