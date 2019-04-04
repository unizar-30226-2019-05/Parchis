package proyecto;
import java.util.Random;
import java.util.Scanner;

public class Tablero {
	private static int MAX;
	private static int numCasillas;
	private static int numDados;
	private static int numFichas = 4;
	private static String[] colores;
	static Jugador[] player;
	static int[][] pos;
	static String[][] casa;
	static Casilla[] casilla;
	static Casilla[][] meta;
	static int[] seguros;
	static int numMeta = 8;
	static int veces6 = 0;
	static int vecesParejas = 0;
	static int lastPlayer = 0;
	static int lastMove = 0;
	static boolean esMeta = false;
	static boolean otroDado = false; // true == hacer tirada normal con dado1 o dado2
	static int valorOtroDado = 0;

	// Constructor de tablero
	Tablero(int _MAX, int dados) throws Exception{
		MAX = _MAX;
		numDados = dados;

		if(MAX == 4){
			numCasillas = 68;
			colores = new String[]{"Rojo","Verde","Amarillo", "Azul"};
			seguros= new int[]{5,12,17,22,29,34,39,46,51,56,63,68};
		}
		else if(MAX == 8){
			numCasillas = 136;
			colores = new String[]{"Rojo","Verde","Amarillo", "Azul",
														 "Negro", "Violeta", "Cyan", "Blanco"};
			seguros= new int[]{5,12,17,22,29,34,39,46,51,56,63,68,
												73,80,85,90,97,102,107,114,119,124,131,136};
		}
		else{
			throw new Exception("La partida a de ser de 4 u 8 jugadores y con 1 o 2 dados");
		}

		player = new Jugador[MAX];
		pos = new int[MAX][numFichas];
		casa = new String[MAX][numFichas];
		casilla = new Casilla[numCasillas];
		meta = new Casilla[MAX][numMeta];
	}


	// Bucle principal del juego
	public static void jugar(){
		for(int i=0;i<MAX;i++) {
      player[i] = new Jugador(colores[i],i);
    }

    rellenar();
    int turno = tirarSalir();

    while(!hayGanador()) {
      System.out.println("Jugador: "+turno);
      turno = tirar(turno) % MAX;
      mostrar();
      mostrarJug();
      mostrarMeta();
    }

    mostrar();
    mostrarJug();
    mostrarMeta();
    System.out.println("\n\n");
	}


	public static void mostrarJug() {
		for(int i=0;i<MAX;i++) {
			String color = player[i].color();
			switch(color) {
			case "Azul":
				MiConsole.println(MiConsole.ANSI_BLUE, "Metidas: "+player[i].metidas()+ " en casa: " + player[i].enCasa());
				break;
			case "Amarillo":
				MiConsole.println(MiConsole.ANSI_YELLOW, "Metidas: "+player[i].metidas()+ " en casa: " + player[i].enCasa());
				break;
			case "Verde":
				MiConsole.println(MiConsole.ANSI_GREEN, "Metidas: "+player[i].metidas()+ " en casa: " + player[i].enCasa());
				break;
			case "Rojo":
				MiConsole.println(MiConsole.ANSI_RED, "Metidas: "+player[i].metidas()+ " en casa: " + player[i].enCasa());
				break;
			case "Negro":
				MiConsole.println(MiConsole.ANSI_BLACK, "Metidas: "+player[i].metidas()+ " en casa: " + player[i].enCasa());
				break;
			case "Violeta":
				MiConsole.println(MiConsole.ANSI_PURPLE, "Metidas: "+player[i].metidas()+ " en casa: " + player[i].enCasa());
				break;
			case "Cyan":
				MiConsole.println(MiConsole.ANSI_CYAN, "Metidas: "+player[i].metidas()+ " en casa: " + player[i].enCasa());
				break;
			case "Blanco":
				MiConsole.println(MiConsole.ANSI_WHITE, "Metidas: "+player[i].metidas()+ " en casa: " + player[i].enCasa());
				break;
			}

			MiConsole.print(MiConsole.ANSI_RESET,"");
		}
	}

	public static void mostrarMeta() {
		for(int i=0;i<MAX;i++) {
			String color = player[i].color();
			switch(color) {
			case "Azul":
				for(int y=0;y<numMeta;y++) {
					MiConsole.print(MiConsole.ANSI_BLUE, (y+1)+": ");
					if(meta[i][y].pos1()) {
						MiConsole.print(MiConsole.ANSI_BLUE, "X ");
					}else {
						MiConsole.print(MiConsole.ANSI_BLUE, "- ");
					}
				}System.out.println();

				break;
			case "Amarillo":
				for(int y=0;y<numMeta;y++) {
					MiConsole.print(MiConsole.ANSI_YELLOW, (y+1)+": ");
					if(meta[i][y].pos1()) {
						MiConsole.print(MiConsole.ANSI_YELLOW, "X ");
					}else {
						MiConsole.print(MiConsole.ANSI_YELLOW, "- ");
					}
				}System.out.println();
				break;
			case "Verde":
				for(int y=0;y<numMeta;y++) {
					MiConsole.print(MiConsole.ANSI_GREEN, (y+1)+": ");
					if(meta[i][y].pos1()) {
						MiConsole.print(MiConsole.ANSI_GREEN, "X ");
					}else {
						MiConsole.print(MiConsole.ANSI_GREEN, "- ");
					}
				}System.out.println();break;
			case "Rojo":
				for(int y=0;y<numMeta;y++) {
					MiConsole.print(MiConsole.ANSI_RED, (y+1)+": ");
					if(meta[i][y].pos1()) {
						MiConsole.print(MiConsole.ANSI_RED, "X ");
					}else {
						MiConsole.print(MiConsole.ANSI_RED, "- ");
					}
				}System.out.println();break;
			case "Negro":
				for(int y=0;y<numMeta;y++) {
					MiConsole.print(MiConsole.ANSI_BLACK, (y+1)+": ");
					if(meta[i][y].pos1()) {
						MiConsole.print(MiConsole.ANSI_BLACK, "X ");
					}else {
						MiConsole.print(MiConsole.ANSI_BLACK, "- ");
					}
				}System.out.println();break;
			case "Violeta":
				for(int y=0;y<numMeta;y++) {
					MiConsole.print(MiConsole.ANSI_PURPLE, (y+1)+": ");
					if(meta[i][y].pos1()) {
						MiConsole.print(MiConsole.ANSI_PURPLE, "X ");
					}else {
						MiConsole.print(MiConsole.ANSI_PURPLE, "- ");
					}
				}System.out.println();break;
			case "Cyan":
				for(int y=0;y<numMeta;y++) {
					MiConsole.print(MiConsole.ANSI_CYAN, (y+1)+": ");
					if(meta[i][y].pos1()) {
						MiConsole.print(MiConsole.ANSI_CYAN, "X ");
					}else {
						MiConsole.print(MiConsole.ANSI_CYAN, "- ");
					}
				}System.out.println();break;
			case "Blanco":
				for(int y=0;y<numMeta;y++) {
					MiConsole.print(MiConsole.ANSI_WHITE, (y+1)+": ");
					if(meta[i][y].pos1()) {
						MiConsole.print(MiConsole.ANSI_WHITE, "X ");
					}else {
						MiConsole.print(MiConsole.ANSI_WHITE, "- ");
					}
				}System.out.println();break;
			}
		}

			MiConsole.print(MiConsole.ANSI_RESET,"");
	}


	public static String mostrar() {
		int i = 1;
		String s = new String("");
		for(Casilla c:casilla) {
			if(c.seguro()) {
				MiConsole.print(MiConsole.ANSI_PURPLE, "ID:" + Integer.toString(i));
				MiConsole.print(MiConsole.ANSI_RESET,"");
			}else {
				System.out.print("ID:" + Integer.toString(i));
			}

			if(c.salida()) {
				System.out.print(" Color: ");
				switch(c.colorSalida()) {
				case "Azul":
					MiConsole.print(MiConsole.ANSI_BLUE, c.colorSalida());
					break;
				case "Amarillo":
					MiConsole.print(MiConsole.ANSI_YELLOW, c.colorSalida());
					break;
				case "Verde":
					MiConsole.print(MiConsole.ANSI_GREEN, c.colorSalida());
					break;
				case "Rojo":
					MiConsole.print(MiConsole.ANSI_RED, c.colorSalida());
					break;
				case "Negro":
					MiConsole.print(MiConsole.ANSI_BLACK, c.colorSalida());
					break;
				case "Violeta":
					MiConsole.println(MiConsole.ANSI_PURPLE, c.colorSalida());
					break;
				case "Cyan":
					MiConsole.println(MiConsole.ANSI_CYAN, c.colorSalida());
					break;
				case "Blanco":
					MiConsole.println(MiConsole.ANSI_WHITE, c.colorSalida());
					break;
				}
				MiConsole.print(MiConsole.ANSI_RESET,"");
			}

			if(c.pos1()) {
				System.out.print(" color1: ");
				switch(c.color1()) {
				case "Azul":
					MiConsole.print(MiConsole.ANSI_BLUE, c.color1());
					break;
				case "Amarillo":
					MiConsole.print(MiConsole.ANSI_YELLOW, c.color1());
					break;
				case "Verde":
					MiConsole.print(MiConsole.ANSI_GREEN, c.color1());
					break;
				case "Rojo":
					MiConsole.print(MiConsole.ANSI_RED, c.color1());
					break;
				case "Negro":
					MiConsole.print(MiConsole.ANSI_BLACK, c.color1());
					break;
				case "Violeta":
					MiConsole.println(MiConsole.ANSI_PURPLE, c.color1());
					break;
				case "Cyan":
					MiConsole.println(MiConsole.ANSI_CYAN, c.color1());
					break;
				case "Blanco":
					MiConsole.println(MiConsole.ANSI_WHITE, c.color1());
					break;
				}
				MiConsole.print(MiConsole.ANSI_RESET,"");
			}
			if(c.pos2()) {
				System.out.print(" color2: ");
				switch(c.color2()) {
				case "Azul":
					MiConsole.print(MiConsole.ANSI_BLUE, c.color2());
					break;
				case "Amarillo":
					MiConsole.print(MiConsole.ANSI_YELLOW, c.color2());
					break;
				case "Verde":
					MiConsole.print(MiConsole.ANSI_GREEN, c.color2());
					break;
				case "Rojo":
					MiConsole.print(MiConsole.ANSI_RED, c.color2());
					break;
				case "Negro":
					MiConsole.print(MiConsole.ANSI_BLACK, c.color2());
					break;
				case "Violeta":
					MiConsole.println(MiConsole.ANSI_PURPLE, c.color2());
					break;
				case "Cyan":
					MiConsole.println(MiConsole.ANSI_CYAN, c.color2());
					break;
				case "Blanco":
					MiConsole.println(MiConsole.ANSI_WHITE, c.color2());
					break;
				}
				MiConsole.print(MiConsole.ANSI_RESET,"");
			}
			if(i%2==0) {
				System.out.print("\n");
			}else {
				System.out.print("                          ");
			}
			i++;
		}
		return s;
	}

	//Actualiza la ficha muerta
	public static void muerto(String s,int posicion) {
		boolean noEncontrado = true;
		for(Jugador j:player) {
			if(j.color()==s) {
				for(int i=0;i<numFichas && noEncontrado;i++) {
					if(pos[j.number()][i]==posicion && casa[j.number()][i] == "FUERA") {
						casa[j.number()][i] = "CASA";
						player[j.number()].muerta(); System.out.println("Casa para jugador " + j.number() + " casilla: "+ i + "aqui, tiene en casa" + j.enCasa());
						noEncontrado = false;
						pos[j.number()][i] = 200;
					}
				}
			}
		}
	}

	//Comprueba que se puede mover dentro de meta
	public static boolean comprobarPosMeta(int i, int pos, int total) {
		if(total<9) {
			boolean si = true;
			for(int y=pos;y<total && si;y++) {
				si = si && meta[i][y].esValido(player[i].color());
			}
			return si;
		}else return false;
	}

	//Comprueba si hay movimiento en meta
	public static boolean comprobarMeta(int i, int value) {
		boolean b = false;
		for(int i1=0;i1<numFichas;i1++) {
			if(casa[i][i1]=="META") {
				int posicion = pos[i][i1]+value;
				b = b || comprobarPosMeta(i,posicion-value,posicion);
			}
		}
		return b;
	}

	//Comprobar movimiento del player, mira todas las fichas
	public static boolean comprobarPlayer(int i, int value) {
		boolean b = false;
		for(int i1=0;i1<numFichas;i1++) {
			if(casa[i][i1]=="FUERA") {
				b = b || comprobarPos(pos[i][i1],value,i);
			}
		}

		return b;
	}

	//Comprobar movimiento de los puentes del player
	public static boolean comprobarPlayerPuente(int i, int value) {
		boolean b = false;
		for(int i1=0;i1<numFichas;i1++) {
			int po = pos[i][i1]-1;
			if(po<0) po=numFichas - 1;
			if(casa[i][i1]=="FUERA" && casilla[po].puente()) {
				b = b || comprobarPos(pos[i][i1],value,i);
			}
		}

		return b;
	}


	//Comprueba si puede mover una ficha en pos i a pos i+i2 del jugador p
	public static boolean comprobarPos(int i,int i2, int p) {
		boolean b = true;	//No se pasa de su m�ximo
		boolean aux = false;
		int x = (p*17)%numCasillas;
		if(x==0) x = numCasillas;
		aux = x>=i && x<(i+i2);
		if(i<=p*17) {
			b = (i+i2)<=(p*17+8);
		}
		b = b && ((aux && x+8>=i+i2) || !aux);
		if(b) {
			for(int y=i;y<(i+i2);y++) {//1 es de la next pos, y el otro del m�dulo
				if(!aux||(y-x)<0) {
					b = b && !casilla[y%numCasillas].puente();
				}else b = b && !meta[p][y-x].pos1();
			}
			if(!aux) {
				System.out.println(i + ";" + i2);
				b = b && casilla[(i+i2-1)%numCasillas].esValido(player[p].color());
			}
		}
		return b;
	}

	//Comprueba si en esa posición se mataría
	public static boolean seMata(int posicion, String s) {
		int pos = posicion-1;
		if(posicion==0) pos=numFichas - 1;
		return casilla[pos].seMata(s);
	}


	public static int selecFichaPuente(int i, int value) {
		int mejor = 0;
		int recorrido = 500;
		boolean mata = false; System.out.println("Llego aqui1");
		for(int i1=0;i1<numFichas;i1++) {
			int po = pos[i][i1]-1;
			if(po<0) po=numFichas - 1;
			if(casa[i][i1]=="FUERA" && casilla[po].puente() && comprobarPos(pos[i][i1],value,i)) {
				int v = pos[i][i1];
				if(!mata && seMata((v+value)%numCasillas,player[i].color())){
					mejor = i1;
					mata = true;
					recorrido = ((i*17%numCasillas+1)-v+value)%numCasillas;
				}else if(mata && seMata((v+value)%numCasillas,player[i].color())) {
					int recorridoNew = ((i*17%numCasillas+1)-v+value)%numCasillas;
					if(recorridoNew<recorrido) {
						mejor = i1;
						mata = true;
						recorrido = ((i*17%numCasillas+1)-v+value)%numCasillas;
					}
				}else if(!mata) {
					int recorridoNew = ((i*17%numCasillas+1)-v+value)%numCasillas;
					if(recorridoNew<recorrido) {
						mejor = i1;
						mata = true;
						recorrido = ((i*17%numCasillas+1)-v+value)%numCasillas;
					}
				}
			}
		}
		return mejor;
	}

	//Seleccionar cual debe mover
	public static int selecFicha(int i,int value) {
		boolean mata = false;
		boolean meta = false;
		boolean aux;
		int mejor = 0;
		int recorrido = 500;
		int x = i*17;
		if(x==0)x=numCasillas;
		for(int i1=0;i1<numFichas;i1++) {
			if(casa[i][i1]=="FUERA") {
				System.out.println("Ficha fuera: " + i1);
				int v = pos[i][i1];
				aux = x>=v && x<(v+value); System.out.println("Inicio");
				System.out.println(v + ";" + value + ";" + i);
				if(comprobarPos(v, value, i)) { System.out.println("Llego aqui1");
					if(aux) {
						int recAux = 8-((v+value)-i*17);
						if(!meta) {
							mejor = i1;
							recorrido = recAux;
							meta = true;
						}else if(recAux<recorrido) {
							mejor = i1;
							recorrido = recAux;
						}
					}else if(!mata && seMata((v+value)%numCasillas,player[i].color())) {
						mejor = i1;
						mata = true;
						recorrido = ((i*17%numCasillas+1)-v+value)%numCasillas;
					}else if(mata && seMata((v+value)%numCasillas,player[i].color())) {
						int recorridoNew = ((i*17%numCasillas+1)-v+value)%numCasillas;
						if(recorridoNew<recorrido) {
							mejor = i1;
							mata = true;
							recorrido = ((i*17%numCasillas+1)-v+value)%numCasillas;
						}
					}else if(!mata) { System.out.println("Llego aqui2");
						int recorridoNew = ((i*17%numCasillas+1)-v+value)%numCasillas;
						if(recorridoNew<recorrido) { System.out.println("Llego aqui3");
							mejor = i1;
							mata = true;
							recorrido = ((i*17%numCasillas+1)-v+value)%numCasillas;
						}
					}
				}
			}
		}
		return mejor;
	}

	//Cuenta el nº de puentes que tiene un jugador
	public static int contarPuentes(int i) {
		int total = 0;
		for(int i1=0;i1<numFichas;i1++) {
			int po = pos[i][i1]-1;
			if(po<0) po=numFichas - 1;
			if(casa[i][i1]=="FUERA" && casilla[po].puente()) {
				total++;
			}
		}
		return total;
	}

	//Comprueba si un jugador tiene puente
	public static boolean hacePuente(int i) {
		boolean b = false;
		for(int i1=0; i1 < numFichas; i1++) {
			int po = pos[i][i1]-1;
			if(po<0) po = numCasillas - 1; //TODO REVISAR
			if(casa[i][i1]=="FUERA") {
				b = b || casilla[po].puente();
			}
		}
		return b;
	}

	public static int tirar(int i) {
		int dado1 = 0;
		int dado2 = 0;
		boolean parejasIguales = false;

		if(!otroDado){
			Random rand = new Random();
			dado1 = 1 + rand.nextInt(6);

			if (numDados == 2) {
				dado2 = 1 + rand.nextInt(6);
				parejasIguales = (dado1 == dado2);
			}
		}

    // Scanner teclado = new Scanner(System.in);
    // System.out.print("Introduzca nº: ");
    // tirada = Integer.parseInt(teclado.nextLine());

		//C1: Caso en el que saca tres seises seguidos --- Tres parejas
    if(!otroDado && ((numDados == 1 && veces6 == 2 && dado1 == 6)
			|| (numDados == 2 && !otroDado && vecesParejas == 2 && parejasIguales))
			&& (!esMeta && player[i].enCasa() < 4 && casa[i][lastMove] == "FUERA")){
			if (pos[i][lastMove] == 0){
				casilla[numFichas - 1].sacar(player[i].color());
			}
			else{
				casilla[pos[i][lastMove]-1].sacar(player[i].color());
			}
			casa[i][lastMove] = "CASA";System.out.println("Aquiiiii4");
			player[i].muerta();
    }
    else if(player[i].enCasa() > 0) { // C2: Tiene fichas en casa
			//Un dado es 5 (para caso de 1 y 2 dados)
			if(dado1==5 || (numDados == 2 &&
				(dado2 == 5 || (otroDado && valorOtroDado == 5))) ) { System.out.println("Aquiiiii1");
				int ficha = fichaEnCasa(i);
				int posicionSalida = 5+i*17; //pos de salida
				// Si no hay ya 2 fichas propias en la casilla de salida
				if(casilla[posicionSalida-1].sePuede(player[i].color())) {
					procesarSacarCasa(i, ficha, posicionSalida, dado1, dado2);
				}
				//No puede sacar de casa aún sacando un 5
				else { System.out.println("Aquiiiii2");
					procesarMover5(i, dado1, dado2);
				}
			}
			//Ningún dado ha salido 5 (caso de 1 y 2 dados)
			else { System.out.println("Aquiiiii3");
				procesarTiradaMoverSinSacar(i, dado1, dado2);
			}
		}
		else{ // C3: No tiene fichas en casa
			System.out.println("Aquiiiii4");
			procesarTiradaMoverSinSacar(i, dado1, dado2);
		}

		// Ya no hay que procesar otra tirada; O no hacia falta o ya se ha hecho
		otroDado = false;

		if(numDados == 1 && dado1 == 6 && veces6 < 2) {
			veces6++;
			return i;
		}
		else if(numDados == 1){
			veces6=0;
			return i+1;
		}
		else if(numDados == 2 && !otroDado && parejasIguales && vecesParejas < 2){
			vecesParejas++;
			return i;
		}
		else if(numDados == 2){
			vecesParejas = 0;
			return i+1;
		}
		else{
			return -1;
		}
	}

	public static void procesarTiradaMoverSinSacar(int i, int dado1, int dado2){
		boolean parejasIguales = dado1 == dado2;
		int sumaDados = dado1 + dado2;
		// Caso de romper puente
		if(((numDados == 1 && dado1==6) ||
			(numDados == 2 && parejasIguales && !otroDado)) && hacePuente(i)
			&& comprobarPlayerPuente(i, dado1)) {
			if(numDados == 1) movNormal(i, dado1, true);
			else movNormal(i, sumaDados, true); //TODO: De momento solo rompe puente con el dado1
		}
		else if(!otroDado && comprobarMeta(i, dado1)){
			movMeta(i, dado1);
			if(numDados == 2){
				otroDado = true;
				valorOtroDado = dado2;
				tirar(i);
			}
		}
		else if(numDados == 2 && otroDado && comprobarMeta(i, valorOtroDado)){
			movMeta(i, valorOtroDado);
		}
		else if(numDados == 2 && !otroDado && comprobarMeta(i, sumaDados)){
			movMeta(i, sumaDados);
		}
		else if(numDados == 2 && !otroDado && comprobarPlayer(i, sumaDados)){
			movNormal(i, sumaDados, false);
		}
		else if(!otroDado && comprobarPlayer(i, dado1)){
			movNormal(i, dado1, false);
			if(numDados == 2){
				otroDado = true;
				valorOtroDado = dado2;
				tirar(i);
			}
		}
		else if(numDados == 2 && otroDado && comprobarPlayer(i, valorOtroDado)){
			movNormal(i, valorOtroDado, false);
		}
	}

	public static void procesarMover5(int i, int dado1, int dado2){
		if(dado1 == 5 || (otroDado && valorOtroDado == 5)){
			if(comprobarMeta(i, dado1)){
				movMeta(i, dado1);
			}
			else if(comprobarPlayer(i, dado1)){
				movNormal(i, dado1, false);
			}
			// Si hay 2 dados 'volver' a tirar con el segundo dado
			if(numDados == 2 && !otroDado){
				otroDado = true;
				valorOtroDado = dado2;
				tirar(i);
			}
		}
		else{ // dado2 == 5, 'volver' a tirar con dado1
			if(comprobarMeta(i, dado2)){
				movMeta(i, dado2);
			}
			else if(comprobarPlayer(i, dado2)){
				movNormal(i , dado2, false);
			}

			otroDado = true;
			valorOtroDado = dado1;
			tirar(i);
		}
	}

	public static void procesarSacarCasa(int i, int ficha, int posicion, int dado1, int dado2){
		System.out.println("Se saca a " + i);
		casa[i][ficha]="FUERA";  System.out.println("Fuera para jugador " + i + " casilla: " + ficha);
		pos[i][ficha]=posicion;
		String s =casilla[posicion-1].introducir(player[i].color());
		player[i].sacar();
		lastPlayer = i;
		lastMove = ficha;
		esMeta = false;
		if(s!="NO") { imprimirPosiciones(i);
			System.out.println("Mata1 " + posicion);muerto(s,posicion);//actualiza al que ha matado
			procesarMatar(i, ficha);
		}

		// Volver a tirar con el otro dado en caso de haberlo
		if ((numDados == 2) && (dado1 == 5) && !otroDado){
			otroDado = true;
			valorOtroDado = dado2;
			tirar(i);
		}
		else if ((numDados == 2) && (dado2 == 5) && !otroDado){
			otroDado = true;
			valorOtroDado = dado1;
			tirar(i);
		}
	}

	public static void procesarMatar(int i, int ficha){
		boolean sePuede = comprobarPlayer(i,20);
		while(sePuede) {
			//Comprobar todos los demás
			ficha = selecFicha(i,20);
			int xx = pos[i][ficha]-1;
			if(xx<0) xx=numFichas - 1;
			casilla[xx].sacar(player[i].color());
			pos[i][ficha] = (pos[i][ficha] + 20)%numCasillas;
			int po1 = (pos[i][ficha]-1);
			if(po1<0) po1=numFichas - 1;
			String s = casilla[po1].introducir(player[i].color());
			sePuede = false;
			int posicion = pos[i][ficha];
			if(s!="NO") {
				//Vuelves a matar a alguien
				imprimirPosiciones(i);System.out.println("Mata4 " + posicion);muerto(s,posicion);	//actualiza al que ha matado
				sePuede = comprobarPlayer(i,20);
			}
		}
	}


	public static void movMeta(int i, int tirada) {
		int mejor = 0;
		int resta = 100;
		for(int i1=0;i1<numFichas;i1++) {
			if(casa[i][i1]=="META") {
				int total = pos[i][i1]+tirada;
				if(comprobarPosMeta(i,pos[i][i1],total)) {
					if(resta>(8-total)) {
						mejor = i1;
						resta = 8-total;
					}
				}
			}
		}
		int v = pos[i][mejor];
		meta[i][pos[i][mejor]-1].sacar(player[i].color());
		pos[i][mejor]+=tirada;
		lastPlayer = i;
		lastMove = mejor;
		esMeta = true;
		if(pos[i][mejor]==8) {	//ha llegado
			casa[i][mejor]="METIDA";
			player[i].meter();
			if(comprobarPlayer(i,10)) {	//Se ha metido una ficha, se pueden sumar 10
				movNormal(i,10,false);
			}
		}else {
			meta[i][pos[i][mejor]-1].introducir(player[i].color());
		}
	}

	//MovNormal de ficha en el que no tiene fichas en casa
	public static void movNormal(int i, int tirada, boolean hayPuente) {
		int ficha = 0;
		if(!hayPuente){ficha = selecFicha(i,tirada);}
		else ficha = selecFichaPuente(i,tirada);
		int po1 = (pos[i][ficha]-1);
		if(po1<0) po1=numFichas - 1;
		System.out.println("Ficha " + ficha);
		System.out.println("Jugador " + i);
		casilla[po1].sacar(player[i].color());
		int v = pos[i][ficha];
		pos[i][ficha] = (pos[i][ficha]+tirada)%numCasillas;
		lastPlayer = i;
		lastMove = ficha;
		int x = i*17;
		if(x==0)x=numCasillas;
		boolean aux = x>=v && x<(v+tirada);
		int cmp = i*17;
		v = pos[i][ficha];
		//if(i==0)cmp = numCasillas;
		if(aux) {	//ha llegado
			esMeta = true;
			pos[i][ficha]-=cmp;
			v = pos[i][ficha];
			meta[i][v-1].introducir(player[i].color());
			casa[i][ficha]="META";
		}else {
			esMeta = false;
			po1 = (pos[i][ficha]-1);
			if(po1<0) po1=numFichas - 1;
			String s = casilla[po1].introducir(player[i].color());
			if(s!="NO") {
				imprimirPosiciones(i);System.out.println("Mata5 " + pos[i][ficha]);muerto(s,pos[i][ficha]);	//actualiza al que ha matado
				boolean sePuede = comprobarPlayer(i,20);
				while(sePuede) {
					//Comprobar todos los dem�s
					ficha = selecFicha(i,20);
					int xx = pos[i][ficha]-1;
					System.out.println("xx "+xx);
					System.out.println("pos "+pos[i][ficha]);
					//if(xx<0) x=numFichas - 1;
					casilla[(xx+numCasillas)%numCasillas].sacar(player[i].color());
					pos[i][ficha] = (pos[i][ficha] + 20)%numCasillas;
					po1 = (pos[i][ficha]-1);
					if(po1<0) po1=numFichas - 1;
					System.out.println(po1);
					s=casilla[po1].introducir(player[i].color());
					sePuede = false;
					if(s!="NO") {
						//Vuelves a matar a alguien
						imprimirPosiciones(i);System.out.println("Mata6 " + pos[i][ficha]);muerto(s,pos[i][ficha]);	//actualiza al que ha matado
						sePuede = comprobarPlayer(i,20);
					}
				}
			}
		}
	}

	//Devuelve la primera ficha que encuentre que está en casa
	public static int fichaEnCasa(int i) {
		int y = 0;
		while(y<numFichas && casa[i][y] !="CASA") y++;
		return y;
	}
	//Detectar si alguien ha acabado
	public static boolean hayGanador() {
		boolean hay = false;
		for(int i=0;i<MAX;i++) {
			hay = hay || player[i].fin();
		}
		return hay;
	}

	//Para determinar quien empieza automaticamente
	public static int tirarSalir() {
		int[] tirada = new int[MAX];
		Random rand = new Random();
		for(int y=0;y<MAX;y++) {
			tirada[y] = rand.nextInt(50);
		}
		int mayor = tirada[0];
		int pos = 0;
		for(int y=1;y<MAX;y++) {
			if(mayor<tirada[y]) {
				mayor = tirada[y];
				pos = y;
			}
		}
		return pos;
	}

	//Devuelve si una pos es segurp
	public static boolean esSeguro(int y) {
		for (int i:seguros) {
			if(i==y) return true;
		}
		return false;
	}

	//Inicializar fichas
	public static void rellenar() {
		for(int i=0;i<MAX;i++) {
			for(int y=0;y<numFichas;y++) {
				casa[i][y] = "CASA";
			}

		}
		for(int y=0;y<MAX;y++) {
			for(int i=0;i<numMeta;i++) {
				meta[y][i] = new Casilla(false,false,player[y].color());
			}
		}

		for(int y=0;y<numCasillas;y++) {
			boolean seguro = esSeguro(y+1);
			boolean salida = ((y+13)%17)==0;
			String s = new String();
			if (salida) s=color(y+1);
			casilla[y] = new Casilla(seguro,salida,s);
		}
	}

	//Busca color al que pertenece la salida
	private static String color(int y) {
		int pos = (y+12)/17-1;
		return colores[pos];
	}

	// Para depurar
	private static void imprimirPosiciones(int p) {
		int i = 0;
		while(i < numFichas){
			System.out.println("Ficha " + i + " en " + pos[p][i]);
			i++;
		}
	}
}
