/* Generated from Java with JSweet 2.2.0-SNAPSHOT - http://www.jsweet.org */
var proyecto;
(function (proyecto) {
    var Casilla = (function () {
        function Casilla(b, b1, s) {
            if (this.__seguro === undefined)
                this.__seguro = false;
            if (this.__salida === undefined)
                this.__salida = false;
            if (this.__colorSalida === undefined)
                this.__colorSalida = null;
            if (this.__puente === undefined)
                this.__puente = false;
            if (this.__pos1 === undefined)
                this.__pos1 = false;
            if (this.__pos2 === undefined)
                this.__pos2 = false;
            if (this.__color1 === undefined)
                this.__color1 = null;
            if (this.__color2 === undefined)
                this.__color2 = null;
            if (this.ultimo === undefined)
                this.ultimo = 0;
            this.__seguro = b;
            this.__salida = b1;
            this.__colorSalida = s;
            this.__puente = false;
            this.__pos1 = false;
            this.__pos2 = false;
            this.__color1 = "";
            this.__color2 = "";
            this.ultimo = 0;
        }
        Casilla.prototype.seguro = function () {
            return this.__seguro;
        };
        Casilla.prototype.salida = function () {
            return this.__salida;
        };
        Casilla.prototype.puente = function () {
            return this.__puente;
        };
        Casilla.prototype.pos1 = function () {
            return this.__pos1;
        };
        Casilla.prototype.pos2 = function () {
            return this.__pos2;
        };
        Casilla.prototype.color1 = function () {
            return this.__color1;
        };
        Casilla.prototype.color2 = function () {
            return this.__color2;
        };
        Casilla.prototype.colorSalida = function () {
            return this.__colorSalida;
        };
        Casilla.prototype.sePuede = function (s) {
            return !this.__pos1 || (this.__seguro && !this.__pos2) || this.esSalidaSuya(s);
        };
        Casilla.prototype.esValido = function (s) {
            return (!this.__pos1 || (this.__pos1 && s !== this.__color1));
        };
        Casilla.prototype.seMata = function (s) {
            if (!this.__seguro) {
                if (this.__pos1 && s !== this.__color1) {
                    return true;
                }
            }
            return false;
        };
        Casilla.prototype.esSalidaSuya = function (s) {
            return this.__salida && (s === this.__colorSalida && (this.__color2 !== s || this.__color1 !== s));
        };
        Casilla.prototype.introducir = function (s) {
            var muerto = "NO";
            if (!this.pos1()) {
                this.__pos1 = true;
                this.__color1 = s;
                this.ultimo = 1;
                if (this.__seguro && this.__pos2)
                    this.__puente = true;
            }
            else if (this.__seguro && !this.__pos2) {
                this.__pos2 = true;
                this.__color2 = s;
                this.__puente = true;
                this.ultimo = 2;
            }
            else if (this.esSalidaSuya(s)) {
                if (this.ultimo === 1 && s !== this.__color1) {
                    muerto = this.__color1;
                    this.__color1 = s;
                }
                else if (this.ultimo === 2 && s !== this.__color2) {
                    muerto = this.__color2;
                    this.__color1 = s;
                }
                else {
                    if (s !== this.__color1) {
                        muerto = this.__color1;
                        this.__color1 = s;
                        this.ultimo = 1;
                    }
                    else {
                        muerto = this.__color2;
                        this.__color2 = s;
                        this.ultimo = 2;
                    }
                }
            }
            else if (!this.__seguro && this.__pos1) {
                muerto = this.__color1;
                this.__color1 = s;
                this.ultimo = 1;
            }
            return muerto;
        };
        Casilla.prototype.sacar = function (s) {
            if (this.__color1 === s) {
                this.__pos1 = false;
                this.__color1 = "";
                if (this.__puente)
                    this.__puente = false;
                this.ultimo = 2;
            }
            else {
                console.info("OUT");
                this.__pos2 = false;
                this.__color2 = "";
                if (this.__puente)
                    this.__puente = false;
                this.ultimo = 1;
            }
        };
        return Casilla;
    }());
    proyecto.Casilla = Casilla;
    Casilla["__class"] = "proyecto.Casilla";
})(proyecto || (proyecto = {}));
