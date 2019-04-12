define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var _a;
    var proyecto;
    var Tablero = /** @class */ (function () {
        //  Constructor de tablero
        function Tablero(_MAX, dados) {
        }
        ;
        ;
        ;
        Tablero.numFichas = 4;
        Tablero.numMeta = 8;
        Tablero.veces6 = 0;
        Tablero.vecesParejas = 0;
        Tablero.lastPlayer = 0;
        Tablero.lastMove = 0;
        Tablero.esMeta = false;
        Tablero.otroDado = false;
        //  true == hacer tirada normal con dado1 o dado2
        Tablero.valorOtroDado = 0;
        return Tablero;
    }());
    exports.Tablero = Tablero;
    seguros = [
        5,
        12,
        17,
        22,
        29,
        34,
        39,
        46,
        51,
        56,
        63,
        68
    ];
    Unknownelseif((MAX == 8));
    {
        numCasillas = 136;
        colores = [
            "Rojo",
            "Verde",
            "Amarillo",
            "Azul",
            "Negro",
            "Violeta",
            "Cyan",
            "Blanco"
        ];
        seguros = [
            5,
            12,
            17,
            22,
            29,
            34,
            39,
            46,
            51,
            56,
            63,
            68,
            73,
            80,
            85,
            90,
            97,
            102,
            107,
            114,
            119,
            124,
            131,
            136
        ];
    }
    {
        throw new Exception("La partida a de ser de 4 u 8 jugadores y con 1 o 2 dados");
    }
    player = new Array(MAX);
    pos = new Array(MAX);
    [numFichas,
        Unknowncasa = new Array(MAX),
        [numFichas,
            Unknowncasilla = new Array(numCasillas),
            meta = new Array(MAX),
            [numMeta,
                UnknownUnknownUnknown
                //  Bucle principal del juego
                ,
                //  Bucle principal del juego
                public, static, jugar(), {}(i < MAX), i++, (_a = {
                        player: player
                    },
                    _a[i] =  = new Jugador(colores[i], i),
                    _a), rellenar(),
                let, turno, number = tirarSalir()]]];
    while (!hayGanador()) {
        System.out.println(("Jugador: " + turno));
        turno = (tirar(turno) % MAX);
    }
    System.out.println(", ");, 
    // Actualiza la ficha muerta
    public, static, muerto(s, String, posicion, number), {
        let: let, noEncontrado: boolean = true,
        in: player
    });
    {
        if ((j.color() == s)) {
            for (var i = 0; ((i < numFichas)
                && noEncontrado); i++) {
                if (((pos[j.number()][i] == posicion)
                    && (casa[j.number()][i] == "FUERA"))) {
                    casa[j.number()][i] = "CASA";
                    player[j.number()].muerta();
                    System.out.println(("Casa para jugador "
                        + (j.number() + (" casilla: "
                            + (i + ("aqui, tiene en casa" + j.enCasa()))))));
                    noEncontrado = false;
                    pos[j.number()][i] = 200;
                }
            }
        }
    }
    comprobarPosMeta(i, number, pos, number, total, number);
    boolean;
    {
        if ((total < 9)) {
            var si = true;
            for (var y = pos; ((y < total)
                && si); y++) {
                si = (si && meta[i][y].esValido(player[i].color()));
            }
            return si;
        }
        else {
            return false;
        }
    }
    comprobarMeta(i, number, value, number);
    boolean;
    {
        var b = false;
        for (var i1 = 0; (i1 < numFichas); i1++) {
            if ((casa[i][i1] == "META")) {
                var posicion = (pos[i][i1] + value);
                b = (b || comprobarPosMeta(i, (posicion - value), posicion));
            }
        }
        return b;
    }
    comprobarPlayer(i, number, value, number);
    boolean;
    {
        var b = false;
        for (var i1 = 0; (i1 < numFichas); i1++) {
            if ((casa[i][i1] == "FUERA")) {
                b = (b || comprobarPos(pos[i][i1], value, i));
            }
        }
        return b;
    }
    comprobarPlayerPuente(i, number, value, number);
    boolean;
    {
        var b = false;
        for (var i1 = 0; (i1 < numFichas); i1++) {
            var po = (pos[i][i1] - 1);
            if ((po < 0)) {
                po = (numFichas - 1);
            }
            if (((casa[i][i1] == "FUERA")
                && casilla[po].puente())) {
                b = (b || comprobarPos(pos[i][i1], value, i));
            }
        }
        return b;
    }
    comprobarPos(i, number, i2, number, p, number);
    boolean;
    {
        var b = true;
        // No se pasa de su m�ximo
        var aux = false;
        var x = ((p * 17)
            % numCasillas);
        if ((x == 0)) {
            x = numCasillas;
        }
        aux = ((x >= i)
            && (x
                < (i + i2)));
        if ((i
            <= (p * 17))) {
            b = ((i + i2)
                <= ((p * 17)
                    + 8));
        }
        b = (b
            && ((aux
                && (x + (8
                    >= (i + i2))))
                || !aux));
        if (b) {
            for (var y = i; (y
                < (i + i2)); y++) {
                // 1 es de la next pos, y el otro del m�dulo
                if ((!aux
                    || ((y - x)
                        < 0))) {
                    b = (b
                        && !casilla[(y % numCasillas)].puente());
                }
                else {
                    b = (b
                        && !meta[p][(y - x)].pos1());
                }
            }
            if (!aux) {
                System.out.println((i + (";" + i2)));
                b = (b && casilla[((i
                    + (i2 - 1))
                    % numCasillas)].esValido(player[p].color()));
            }
        }
        return b;
    }
    seMata(posicion, number, s, String);
    boolean;
    {
        var pos = (posicion - 1);
        if ((posicion == 0)) {
            pos = (numFichas - 1);
        }
        return casilla[pos].seMata(s);
    }
    selecFichaPuente(i, number, value, number);
    number;
    {
        var mejor = 0;
        var recorrido = 500;
        var mata = false;
        System.out.println("Llego aqui1");
        for (var i1 = 0; (i1 < numFichas); i1++) {
            var po = (pos[i][i1] - 1);
            if ((po < 0)) {
                po = (numFichas - 1);
            }
            if (((casa[i][i1] == "FUERA")
                && (casilla[po].puente() && comprobarPos(pos[i][i1], value, i)))) {
                var v = pos[i][i1];
                if ((!mata
                    && seMata(((v + value)
                        % numCasillas), player[i].color()))) {
                    mejor = i1;
                    mata = true;
                    recorrido = (((((i * (17 % numCasillas))
                        + 1)
                        - v)
                        + value)
                        % numCasillas);
                }
                else if ((mata && seMata(((v + value)
                    % numCasillas), player[i].color()))) {
                    var recorridoNew = (((((i * (17 % numCasillas))
                        + 1)
                        - v)
                        + value)
                        % numCasillas);
                    if ((recorridoNew < recorrido)) {
                        mejor = i1;
                        mata = true;
                        recorrido = (((((i * (17 % numCasillas))
                            + 1)
                            - v)
                            + value)
                            % numCasillas);
                    }
                }
                else if (!mata) {
                    var recorridoNew = (((((i * (17 % numCasillas))
                        + 1)
                        - v)
                        + value)
                        % numCasillas);
                    if ((recorridoNew < recorrido)) {
                        mejor = i1;
                        mata = true;
                        recorrido = (((((i * (17 % numCasillas))
                            + 1)
                            - v)
                            + value)
                            % numCasillas);
                    }
                }
            }
        }
        return mejor;
    }
    selecFicha(i, number, value, number);
    number;
    {
        var mata = false;
        var meta = false;
        var aux = void 0;
        var mejor = 0;
        var recorrido = 500;
        var x = (i * 17);
        if ((x == 0)) {
            x = numCasillas;
        }
        for (var i1 = 0; (i1 < numFichas); i1++) {
            if ((casa[i][i1] == "FUERA")) {
                System.out.println(("Ficha fuera: " + i1));
                var v = pos[i][i1];
                aux = ((x >= v)
                    && (x
                        < (v + value)));
                System.out.println("Inicio");
                System.out.println((v + (";"
                    + (value + (";" + i)))));
                if (comprobarPos(v, value, i)) {
                    System.out.println("Llego aqui1");
                    if (aux) {
                        var recAux = (8
                            - ((v + value)
                                - (i * 17)));
                        if (!meta) {
                            mejor = i1;
                            recorrido = recAux;
                            meta = true;
                        }
                        else if ((recAux < recorrido)) {
                            mejor = i1;
                            recorrido = recAux;
                        }
                    }
                    else if ((!mata
                        && seMata(((v + value)
                            % numCasillas), player[i].color()))) {
                        mejor = i1;
                        mata = true;
                        recorrido = (((((i * (17 % numCasillas))
                            + 1)
                            - v)
                            + value)
                            % numCasillas);
                    }
                    else if ((mata && seMata(((v + value)
                        % numCasillas), player[i].color()))) {
                        var recorridoNew = (((((i * (17 % numCasillas))
                            + 1)
                            - v)
                            + value)
                            % numCasillas);
                        if ((recorridoNew < recorrido)) {
                            mejor = i1;
                            mata = true;
                            recorrido = (((((i * (17 % numCasillas))
                                + 1)
                                - v)
                                + value)
                                % numCasillas);
                        }
                    }
                    else if (!mata) {
                        System.out.println("Llego aqui2");
                        var recorridoNew = (((((i * (17 % numCasillas))
                            + 1)
                            - v)
                            + value)
                            % numCasillas);
                        if ((recorridoNew < recorrido)) {
                            System.out.println("Llego aqui3");
                            mejor = i1;
                            mata = true;
                            recorrido = (((((i * (17 % numCasillas))
                                + 1)
                                - v)
                                + value)
                                % numCasillas);
                        }
                    }
                }
            }
        }
        return mejor;
    }
    contarPuentes(i, number);
    number;
    {
        var total = 0;
        for (var i1 = 0; (i1 < numFichas); i1++) {
            var po = (pos[i][i1] - 1);
            if ((po < 0)) {
                po = (numFichas - 1);
            }
            if (((casa[i][i1] == "FUERA")
                && casilla[po].puente())) {
                total++;
            }
        }
        return total;
    }
    hacePuente(i, number);
    boolean;
    {
        var b = false;
        for (var i1 = 0; (i1 < numFichas); i1++) {
            var po = (pos[i][i1] - 1);
            if ((po < 0)) {
                po = (numCasillas - 1);
            }
            // TODO REVISAR
            if ((casa[i][i1] == "FUERA")) {
                b = (b || casilla[po].puente());
            }
        }
        return b;
    }
    tirar(i, number);
    number;
    {
        var dado1 = 0;
        var dado2 = 0;
        var parejasIguales = false;
        if (!otroDado) {
            var rand = new Random();
            dado1 = (1 + rand.nextInt(6));
            if ((numDados == 2)) {
                dado2 = (1 + rand.nextInt(6));
                parejasIguales = (dado1 == dado2);
            }
        }
        //  Scanner teclado = new Scanner(System.in);
        //  System.out.print("Introduzca n�: ");
        //  tirada = Integer.parseInt(teclado.nextLine());
        // C1: Caso en el que saca tres seises seguidos --- Tres parejas
        if ((!otroDado
            && ((((numDados == 1)
                && ((veces6 == 2)
                    && (dado1 == 6)))
                || ((numDados == 2)
                    && (!otroDado
                        && ((vecesParejas == 2)
                            && parejasIguales))))
                && (!esMeta
                    && ((player[i].enCasa() < 4)
                        && (casa[i][lastMove] == "FUERA")))))) {
            if ((pos[i][lastMove] == 0)) {
                casilla[(numFichas - 1)].sacar(player[i].color());
            }
            else {
                casilla[(pos[i][lastMove] - 1)].sacar(player[i].color());
            }
            casa[i][lastMove] = "CASA";
            System.out.println("Aquiiiii4");
            player[i].muerta();
        }
        else if ((player[i].enCasa() > 0)) {
            //  C2: Tiene fichas en casa
            // Un dado es 5 (para caso de 1 y 2 dados)
            if (((dado1 == 5)
                || ((numDados == 2)
                    && ((dado2 == 5)
                        || (otroDado
                            && (valorOtroDado == 5)))))) {
                System.out.println("Aquiiiii1");
                var ficha = fichaEnCasa(i);
                var posicionSalida = (5
                    + (i * 17));
                // pos de salida
                //  Si no hay ya 2 fichas propias en la casilla de salida
                if (casilla[(posicionSalida - 1)].sePuede(player[i].color())) {
                    procesarSacarCasa(i, ficha, posicionSalida, dado1, dado2);
                }
                // No puede sacar de casa a�n sacando un 5
                System.out.println("Aquiiiii2");
                procesarMover5(i, dado1, dado2);
            }
            // Ning�n dado ha salido 5 (caso de 1 y 2 dados)
            System.out.println("Aquiiiii3");
            procesarTiradaMoverSinSacar(i, dado1, dado2);
        }
        else {
            //  C3: No tiene fichas en casa
            System.out.println("Aquiiiii4");
            procesarTiradaMoverSinSacar(i, dado1, dado2);
        }
        //  Ya no hay que procesar otra tirada; O no hacia falta o ya se ha hecho
        otroDado = false;
        if (((numDados == 1)
            && ((dado1 == 6)
                && (veces6 < 2)))) {
            veces6++;
            return i;
        }
        else if ((numDados == 1)) {
            veces6 = 0;
            return (i + 1);
        }
        else if (((numDados == 2)
            && (!otroDado
                && (parejasIguales
                    && (vecesParejas < 2))))) {
            vecesParejas++;
            return i;
        }
        else if ((numDados == 2)) {
            vecesParejas = 0;
            return (i + 1);
        }
        else {
            return -1;
        }
    }
    procesarTiradaMoverSinSacar(i, number, dado1, number, dado2, number);
    {
        var parejasIguales = (dado1 == dado2);
        var sumaDados = (dado1 + dado2);
        //  Caso de romper puente
        if (((((numDados == 1)
            && (dado1 == 6))
            || ((numDados == 2)
                && (parejasIguales
                    && !otroDado)))
            && (hacePuente(i) && comprobarPlayerPuente(i, dado1)))) {
            if ((numDados == 1)) {
                movNormal(i, dado1, true);
            }
            else {
                movNormal(i, sumaDados, true);
            }
            // TODO: De momento solo rompe puente con el dado1
        }
        else if ((!otroDado
            && comprobarMeta(i, dado1))) {
            movMeta(i, dado1);
            if ((numDados == 2)) {
                otroDado = true;
                valorOtroDado = dado2;
                tirar(i);
            }
        }
        else if (((numDados == 2)
            && (otroDado && comprobarMeta(i, valorOtroDado)))) {
            movMeta(i, valorOtroDado);
        }
        else if (((numDados == 2)
            && (!otroDado
                && comprobarMeta(i, sumaDados)))) {
            movMeta(i, sumaDados);
        }
        else if (((numDados == 2)
            && (!otroDado
                && comprobarPlayer(i, sumaDados)))) {
            movNormal(i, sumaDados, false);
        }
        else if ((!otroDado
            && comprobarPlayer(i, dado1))) {
            movNormal(i, dado1, false);
            if ((numDados == 2)) {
                otroDado = true;
                valorOtroDado = dado2;
                tirar(i);
            }
        }
        else if (((numDados == 2)
            && (otroDado && comprobarPlayer(i, valorOtroDado)))) {
            movNormal(i, valorOtroDado, false);
        }
    }
    procesarMover5(i, number, dado1, number, dado2, number);
    {
        if (((dado1 == 5)
            || (otroDado
                && (valorOtroDado == 5)))) {
            if (comprobarMeta(i, dado1)) {
                movMeta(i, dado1);
            }
            else if (comprobarPlayer(i, dado1)) {
                movNormal(i, dado1, false);
            }
            //  Si hay 2 dados 'volver' a tirar con el segundo dado
            if (((numDados == 2)
                && !otroDado)) {
                otroDado = true;
                valorOtroDado = dado2;
                tirar(i);
            }
        }
        else {
            //  dado2 == 5, 'volver' a tirar con dado1
            if (comprobarMeta(i, dado2)) {
                movMeta(i, dado2);
            }
            else if (comprobarPlayer(i, dado2)) {
                movNormal(i, dado2, false);
            }
            otroDado = true;
            valorOtroDado = dado1;
            tirar(i);
        }
    }
    procesarSacarCasa(i, number, ficha, number, posicion, number, dado1, number, dado2, number);
    {
        System.out.println(("Se saca a " + i));
        casa[i][ficha] = "FUERA";
        System.out.println(("Fuera para jugador "
            + (i + (" casilla: " + ficha))));
        pos[i][ficha] = posicion;
        var s = casilla[(posicion - 1)].introducir(player[i].color());
        player[i].sacar();
        lastPlayer = i;
        lastMove = ficha;
        esMeta = false;
        if ((s != "NO")) {
            imprimirPosiciones(i);
            System.out.println(("Mata1 " + posicion));
            muerto(s, posicion);
            // actualiza al que ha matado
            procesarMatar(i, ficha);
        }
        //  Volver a tirar con el otro dado en caso de haberlo
        if (((numDados == 2)
            && ((dado1 == 5)
                && !otroDado))) {
            otroDado = true;
            valorOtroDado = dado2;
            tirar(i);
        }
        else if (((numDados == 2)
            && ((dado2 == 5)
                && !otroDado))) {
            otroDado = true;
            valorOtroDado = dado1;
            tirar(i);
        }
    }
    procesarMatar(i, number, ficha, number);
    {
        var sePuede = comprobarPlayer(i, 20);
        while (sePuede) {
            // Comprobar todos los dem�s
            ficha = selecFicha(i, 20);
            var xx = (pos[i][ficha] - 1);
            if ((xx < 0)) {
                xx = (numFichas - 1);
            }
            casilla[xx].sacar(player[i].color());
            pos[i][ficha] = ((pos[i][ficha] + 20)
                % numCasillas);
            var po1 = (pos[i][ficha] - 1);
            if ((po1 < 0)) {
                po1 = (numFichas - 1);
            }
            var s = casilla[po1].introducir(player[i].color());
            sePuede = false;
            var posicion = pos[i][ficha];
            if ((s != "NO")) {
                // Vuelves a matar a alguien
                imprimirPosiciones(i);
                System.out.println(("Mata4 " + posicion));
                muerto(s, posicion);
                // actualiza al que ha matado
                sePuede = comprobarPlayer(i, 20);
            }
        }
    }
    movMeta(i, number, tirada, number);
    {
        var mejor = 0;
        var resta = 100;
        for (var i1 = 0; (i1 < numFichas); i1++) {
            if ((casa[i][i1] == "META")) {
                var total = (pos[i][i1] + tirada);
                if (comprobarPosMeta(i, pos[i][i1], total)) {
                    if ((resta > (8 - total))) {
                        mejor = i1;
                        resta = (8 - total);
                    }
                }
            }
        }
        var v = pos[i][mejor];
        meta[i][(pos[i][mejor] - 1)].sacar(player[i].color());
        pos[i][mejor] = (pos[i][mejor] + tirada);
        lastPlayer = i;
        lastMove = mejor;
        esMeta = true;
        if ((pos[i][mejor] == 8)) {
            // ha llegado
            casa[i][mejor] = "METIDA";
            player[i].meter();
            if (comprobarPlayer(i, 10)) {
                // Se ha metido una ficha, se pueden sumar 10
                movNormal(i, 10, false);
            }
        }
        else {
            meta[i][(pos[i][mejor] - 1)].introducir(player[i].color());
        }
    }
    movNormal(i, number, tirada, number, hayPuente, boolean);
    {
        var ficha = 0;
        if (!hayPuente) {
            ficha = selecFicha(i, tirada);
        }
        else {
            ficha = selecFichaPuente(i, tirada);
        }
        var po1 = (pos[i][ficha] - 1);
        if ((po1 < 0)) {
            po1 = (numFichas - 1);
        }
        System.out.println(("Ficha " + ficha));
        System.out.println(("Jugador " + i));
        casilla[po1].sacar(player[i].color());
        var v = pos[i][ficha];
        pos[i][ficha] = ((pos[i][ficha] + tirada)
            % numCasillas);
        lastPlayer = i;
        lastMove = ficha;
        var x = (i * 17);
        if ((x == 0)) {
            x = numCasillas;
        }
        var aux = ((x >= v)
            && (x
                < (v + tirada)));
        var cmp = (i * 17);
        v = pos[i][ficha];
        // if(i==0)cmp = numCasillas;
        if (aux) {
            // ha llegado
            esMeta = true;
            pos[i][ficha] = (pos[i][ficha] - cmp);
            v = pos[i][ficha];
            meta[i][(v - 1)].introducir(player[i].color());
            casa[i][ficha] = "META";
        }
        else {
            esMeta = false;
            po1 = (pos[i][ficha] - 1);
            if ((po1 < 0)) {
                po1 = (numFichas - 1);
            }
            var s = casilla[po1].introducir(player[i].color());
            if ((s != "NO")) {
                imprimirPosiciones(i);
                System.out.println(("Mata5 " + pos[i][ficha]));
                muerto(s, pos[i][ficha]);
                // actualiza al que ha matado
                var sePuede = comprobarPlayer(i, 20);
                while (sePuede) {
                    // Comprobar todos los dem�s
                    ficha = selecFicha(i, 20);
                    var xx = (pos[i][ficha] - 1);
                    System.out.println(("xx " + xx));
                    System.out.println(("pos " + pos[i][ficha]));
                    // if(xx<0) x=numFichas - 1;
                    casilla[((xx + numCasillas)
                        % numCasillas)].sacar(player[i].color());
                    pos[i][ficha] = ((pos[i][ficha] + 20)
                        % numCasillas);
                    po1 = (pos[i][ficha] - 1);
                    if ((po1 < 0)) {
                        po1 = (numFichas - 1);
                    }
                    System.out.println(po1);
                    s = casilla[po1].introducir(player[i].color());
                    sePuede = false;
                    if ((s != "NO")) {
                        // Vuelves a matar a alguien
                        imprimirPosiciones(i);
                        System.out.println(("Mata6 " + pos[i][ficha]));
                        muerto(s, pos[i][ficha]);
                        // actualiza al que ha matado
                        sePuede = comprobarPlayer(i, 20);
                    }
                }
            }
        }
    }
    fichaEnCasa(i, number);
    number;
    {
        var y = 0;
        while (((y < numFichas)
            && (casa[i][y] != "CASA"))) {
            y++;
        }
        return y;
    }
    hayGanador();
    boolean;
    {
        var hay = false;
        for (var i = 0; (i < MAX); i++) {
            hay = (hay || player[i].fin());
        }
        return hay;
    }
    tirarSalir();
    number;
    {
        var tirada = new Array(MAX);
        var rand = new Random();
        for (var y = 0; (y < MAX); y++) {
            tirada[y] = rand.nextInt(50);
        }
        var mayor = tirada[0];
        var pos = 0;
        for (var y = 1; (y < MAX); y++) {
            if ((mayor < tirada[y])) {
                mayor = tirada[y];
                pos = y;
            }
        }
        return pos;
    }
    esSeguro(y, number);
    boolean;
    {
        for (var i in seguros) {
            if ((i == y)) {
                return true;
            }
        }
        return false;
    }
    rellenar();
    {
        for (var i = 0; (i < MAX); i++) {
            for (var y = 0; (y < numFichas); y++) {
                casa[i][y] = "CASA";
            }
        }
        for (var y = 0; (y < MAX); y++) {
            for (var i = 0; (i < numMeta); i++) {
                meta[y][i] = new Casilla(false, false, player[y].color());
            }
        }
        for (var y = 0; (y < numCasillas); y++) {
            var seguro = esSeguro((y + 1));
            var salida = (((y + 13)
                % 17)
                == 0);
            var s = new String();
            if (salida) {
                s = color((y + 1));
            }
            casilla[y] = new Casilla(seguro, salida, s);
        }
    }
    color(y, number);
    String;
    {
        var pos = (((y + 12)
            / 17)
            - 1);
        return colores[pos];
    }
    imprimirPosiciones(p, number);
    {
        var i = 0;
        while ((i < numFichas)) {
            System.out.println(("Ficha "
                + (i + (" en " + pos[p][i]))));
            i++;
        }
    }
});
