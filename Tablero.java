package proyecto;
import java.util.Random;
import java.util.Scanner;

public class Tablero {
	private static int MAX;
	private static int numCasillas;
	private static int numFichas;
	private static String[] colores;
	static Jugador[] player;
	static int[][] pos;
	static String[][] casa;
	static Casilla[] casilla;
	static Casilla[][] meta;
	static int[] seguros;
	static int numMeta = 8;
	static int veces6 = 0;
	static int lastPlayer = 0;
	static int lastMove = 0;
	static boolean esMeta = false;
	
	Tablero(int _MAX, int _numCasillas, int _numFichas, String _colores[], Jugador _player[], int _pos [][],
					String _casa[][], Casilla _casilla[], Casilla _meta[][], int _seguros[]){
		MAX = _MAX;
		numCasillas = _numCasillas;
		numFichas = _numFichas;
		colores = _colores;
		player = _player;
		pos = _pos;
		casa = _casa;
		casilla = _casilla;
		meta = _meta;
		seguros = _seguros;
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
		for(Jugador j:player) {
			if(j.color()==s) {
				for(int i=0;i<MAX;i++) {
					if(pos[j.number()][i]==posicion) {
						casa[j.number()][i] = "CASA";
						player[j.number()].muerta();
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
		for(int i1=0;i1<MAX;i1++) {
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
		for(int i1=0;i1<MAX;i1++) {
			if(casa[i][i1]=="FUERA") {
				b = b || comprobarPos(pos[i][i1],value,i);
			}
		}
		
		return b;
	}
	
	//Comprobar movimiento de los puentes del player
	public static boolean comprobarPlayerPuente(int i, int value) {
		boolean b = false;
		for(int i1=0;i1<MAX;i1++) {
			int po = pos[i][i1]-1;
			if(po<0) po=67;
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
		int x = (p*17)%68;
		if(x==0) x = 68;
		aux = x>=i && x<(i+i2);
		if(i<=p*17) {
			b = (i+i2)<=(p*17+8);
		}
		b = b && ((aux && x+8>=i+i2) || !aux);
		if(b) {
			for(int y=i;y<(i+i2);y++) {//1 es de la next pos, y el otro del m�dulo
				if(!aux||(y-x)<0) {
					b = b && !casilla[y%68].puente();					
				}else b = b && !meta[p][y-x].pos1();
			}
			if(!aux) {
				b = b && casilla[(i+i2-1)%68].esValido(player[p].color());
			}
		}
		return b;
	}
	
	//Comprueba si en esa posici�n se matar�a
	public static boolean seMata(int posicion, String s) {
		int pos = posicion-1;
		if(posicion==0) pos=67;
		return casilla[pos].seMata(s);
	}
	
	
	public static int selecFichaPuente(int i, int value) {
		int mejor = 0;
		int recorrido = 100;
		boolean mata = false;
		for(int i1=0;i1<MAX;i1++) {
			int po = pos[i][i1]-1;
			if(po<0) po=67;
			if(casa[i][i1]=="FUERA" && casilla[po].puente() && comprobarPos(pos[i][i1],value,i)) {
				int v = pos[i][i1];
				if(!mata && seMata((v+value)%68,player[i].color())){
					mejor = i1;
					mata = true;
					recorrido = ((i*17%numCasillas+1)-v+value)%68;
				}else if(mata && seMata((v+value)%68,player[i].color())) {
					int recorridoNew = ((i*17%numCasillas+1)-v+value)%68;
					if(recorridoNew<recorrido) {
						mejor = i1;
						mata = true;
						recorrido = ((i*17%numCasillas+1)-v+value)%68;
					}
				}else if(!mata) {
					int recorridoNew = ((i*17%numCasillas+1)-v+value)%68;
					if(recorridoNew<recorrido) {
						mejor = i1;
						mata = true;
						recorrido = ((i*17%numCasillas+1)-v+value)%68;
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
		int recorrido = 100;
		int x = i*17;
		if(x==0)x=68;
		for(int i1=0;i1<MAX;i1++) {
			if(casa[i][i1]=="FUERA") {
				int v = pos[i][i1];
				aux = x>=v && x<(v+value); 
				if(comprobarPos(v,value,i)) {
					if(aux) {
						int recAux = 8-((v+value)-i*17);
						if(!meta) {
							mejor = i1;
							recorrido = recAux;
						}else if(recAux<recorrido) {
							mejor = i1;
							recorrido = recAux;
						}
					}else if(!mata && seMata((v+value)%68,player[i].color())) {
						mejor = i1;
						mata = true;
						recorrido = ((i*17%numCasillas+1)-v+value)%68;
					}else if(mata && seMata((v+value)%68,player[i].color())) {
						int recorridoNew = ((i*17%numCasillas+1)-v+value)%68;
						if(recorridoNew<recorrido) {
							mejor = i1;
							mata = true;
							recorrido = ((i*17%numCasillas+1)-v+value)%68;
						}
					}else if(!mata) {
						int recorridoNew = ((i*17%numCasillas+1)-v+value)%68;
						if(recorridoNew<recorrido) {
							mejor = i1;
							mata = true;
							recorrido = ((i*17%numCasillas+1)-v+value)%68;
						}
					}
				}
			}
		}
		return mejor;
	}
	
	//Cuenta el n� de puentes que tiene un jugador
	public static int contarPuentes(int i) {
		int total = 0;
		for(int i1=0;i1<MAX;i1++) {
			int po = pos[i][i1]-1;
			if(po<0) po=67;
			if(casa[i][i1]=="FUERA" && casilla[po].puente()) {
				total++;
			}
		}
		return total;
	}
	
	//Comprueba si un jugador tiene puente
	public static boolean hacePuente(int i) {
		boolean b = false;
		for(int i1=0;i1<MAX;i1++) {
			int po = pos[i][i1]-1;
			if(po<0) po=67;
			if(casa[i][i1]=="FUERA") {
				b = b || casilla[po].puente();
			}
		}
		return b;
	}
	
	public static int tirar(int i,int tirada) {
		Random rand = new Random();
		tirada = 1+rand.nextInt(6);
        //System.out.print("Tirada: "+tirada);
		//tirada = 5;
        Scanner teclado = new Scanner(System.in);
        System.out.print("Introduzca nº: ");
        tirada = Integer.parseInt(teclado.nextLine());
        if(veces6==2 && tirada==6 && !esMeta && (lastMove != 0 || (lastMove == 0 && casa[i][lastMove] != "CASA"))) {
			//Caso en el que saca tres seises seguidos
			casilla[pos[i][lastMove]-1].sacar(player[i].color());	System.out.println("Llego");
			casa[i][lastMove] = "CASA";
			player[i].muerta();
        }else if (veces6<3){
        	//Caso en el que solo puede sacar 5 para mover
        	if(player[i].enCasa()==4) {			
				if(tirada==5) {
					int ficha = fichaEnCasa(i);				
					casa[i][ficha]="FUERA";
					int posicion = 5+i*17; //pos de salida
					pos[i][ficha]=posicion;
					String s =casilla[posicion-1].introducir(player[i].color());
					player[i].sacar();
					lastPlayer = i;
					lastMove = ficha;
					esMeta = false;
					if(s!="NO") {
						muerto(s,posicion);	//actualiza al que ha matado
						boolean sePuede = comprobarPos(posicion,posicion+20,i);
						while(sePuede) {
							int xx = posicion-1;						
							casilla[xx].sacar(player[i].color());
							pos[i][ficha] = (pos[i][ficha] + 20)%68;
							int po1 = (pos[i][ficha]-1);
							if(po1<0) po1=67; 
							s = casilla[po1].introducir(player[i].color());
							sePuede = false;
							posicion = pos[i][ficha];
							if(s!="NO") {
								//Vuelves a matar a alguien
								muerto(s,posicion);	//actualiza al que ha matado
								sePuede = comprobarPos(posicion,posicion+20,i);
							}
						}
					}
				}
			}
			//caso en el que sigue teniendo en casa
			else if(player[i].enCasa()>0) {
				//Si saca 5 comprobar si puede sacar
				if(tirada==5) {
					int ficha = fichaEnCasa(i);
					int posicion = 5+i*17; //pos de salida
					if(casilla[posicion-1].sePuede(player[i].color())) {
						casa[i][ficha]="FUERA";
						pos[i][ficha]=posicion;
						String s = new String();
						s = casilla[posicion-1].introducir(player[i].color());	
						lastPlayer = i;
						lastMove = ficha;
						esMeta = false;
						if(s!="NO") {
							muerto(s,posicion);	//actualiza al que ha matado
							boolean sePuede = comprobarPlayer(i,20);
							while(sePuede) {
								//Comprobar todos los dem�s
								ficha = selecFicha(i,20);
								int xx = pos[i][ficha]-1;
								casilla[xx].sacar(player[i].color());
								pos[i][ficha] = (pos[i][ficha] + 20)%68;
								int po1 = (pos[i][ficha]-1);
								if(po1<0) po1=67; 
								s=casilla[po1].introducir(player[i].color());
								sePuede = false;
								posicion = pos[i][ficha];
								if(s!="NO") {
									//Vuelves a matar a alguien
									muerto(s,posicion);	//actualiza al que ha matado
									sePuede = comprobarPlayer(i,20);
								}
							}
						}
						player[i].sacar();
					}
					//no puede sacar de casa a�n sacando un 5
					else {
						if(comprobarMeta(i,tirada)) {movMeta(i,tirada);}
						else if(comprobarPlayer(i,tirada)) {movNormal(i,tirada,false);}
					}
				}
				//La tirada ha sido distinta a 5
				else {
					if(tirada==6 && hacePuente(i) && comprobarPlayerPuente(i,tirada)) {	//Caso de puente movible y obligatorio
						movNormal(i,tirada,true); 
					}
					else if(comprobarMeta(i,tirada)) {movMeta(i,tirada);}
					else if(comprobarPlayer(i,tirada)) {movNormal(i,tirada,false);}
				}
			}else {
				if(tirada==6 && hacePuente(i) && comprobarPlayerPuente(i,tirada)) {	//Caso de puente movible y obligatorio
					movNormal(i,tirada,true); 	
				}
				else if(comprobarMeta(i,tirada)) {movMeta(i,tirada);}
				else if(comprobarPlayer(i,tirada)) {movNormal(i,tirada,false);}
			}
        }
		if(tirada==6 && veces6<2) {
			veces6++;
			return i;
		}else {
			veces6=0;
			return i+1;
		}
	}
	
	
	public static void movMeta(int i, int tirada) {
		int mejor = 0;
		int resta = 100;
		for(int i1=0;i1<MAX;i1++) {
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
		if(!hayPuente)ficha = selecFicha(i,tirada);
		else ficha = selecFichaPuente(i,tirada);
		int po1 = (pos[i][ficha]-1);
		if(po1<0) po1=67; 
		casilla[po1].sacar(player[i].color());
		int v = pos[i][ficha];
		pos[i][ficha] = (pos[i][ficha]+tirada)%68;
		lastPlayer = i;
		lastMove = ficha;
		int x = i*17;
		if(x==0)x=68;
		boolean aux = x>=v && x<(v+tirada);
		int cmp = i*17;
		v = pos[i][ficha];
		//if(i==0)cmp = 68;
		if(aux) {	//ha llegado
			esMeta = true;
			pos[i][ficha]-=cmp;
			v = pos[i][ficha];
			meta[i][v-1].introducir(player[i].color());
			casa[i][ficha]="META";
		}else {
			esMeta = false;
			po1 = (pos[i][ficha]-1);
			if(po1<0) po1=67; 
			String s = casilla[po1].introducir(player[i].color());
			if(s!="NO") {
				muerto(s,pos[i][ficha]);	//actualiza al que ha matado
				boolean sePuede = comprobarPlayer(i,20);
				while(sePuede) {
					//Comprobar todos los dem�s
					ficha = selecFicha(i,20);
					int xx = pos[i][ficha]-1;
					System.out.println("xx "+xx);	
					System.out.println("pos "+pos[i][ficha]);	
					//if(xx<0) x=67; 
					casilla[(xx+68)%68].sacar(player[i].color());
					pos[i][ficha] = (pos[i][ficha] + 20)%68;
					po1 = (pos[i][ficha]-1);
					if(po1<0) po1=67; 
					System.out.println(po1);					
					s=casilla[po1].introducir(player[i].color());
					sePuede = false;
					if(s!="NO") {
						//Vuelves a matar a alguien
						muerto(s,pos[i][ficha]);	//actualiza al que ha matado
						sePuede = comprobarPlayer(i,20);
					}
				}
			}
		}
		
	
	}
	
	//Devuelve la primera ficha que encuentre que est� en casa
	public static int fichaEnCasa(int i) {
		int y = 0;
		while(y<MAX && casa[i][y] !="CASA") y++;
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
			for(int y=0;y<MAX;y++) {
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
}