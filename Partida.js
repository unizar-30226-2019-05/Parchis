define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var proyecto;
    var Partida = /** @class */ (function () {
        function Partida() {
        }
        Partida.main = function (args) {
            try {
                var teclado = new Scanner(System.in);
                System.out.print("Introduzca n� de jugadores (4 u 8): ");
                var numJugadores = Integer.parseInt(teclado.nextLine());
                System.out.print("Introduzca n� de dados (1 o 2): ");
                var numDados = Integer.parseInt(teclado.nextLine());
                var t = new Tablero(numJugadores, numDados);
                t.jugar();
            }
            catch (e /*:Exception*/) {
                System.out.println(e.getMessage());
                e.printStackTrace();
            }
        };
        return Partida;
    }());
    exports.Partida = Partida;
});
