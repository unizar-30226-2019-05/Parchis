package proyecto;
import java.util.Random;
import java.util.Scanner;

public class Tablero8 {
	private static int MAX = 8;
	private static int NUM_FICHAS = 4;
	private static int numCasillas = 136;
    private static int numMeta = 8;
	private static String[] colores = {"Rojo","Verde","Amarillo", "Azul", "Negro", "Violeta", "Cyan", "Blanco"};
	static Jugador[] player = new Jugador[MAX];
	static int[][] pos = new int[MAX][NUM_FICHAS];
	static String[][] casa = new String[MAX][NUM_FICHAS];;
	static Casilla[] casilla = new Casilla[numCasillas];
	static Casilla[][] meta = new Casilla[MAX][numMeta];
	static int[] seguros= {5,12,17,22,29,34,39,46,51,56,63,68,
                           73,80,85,90,97,102,107,114,119,124,131,136};
	private static Tablero t8 = new Tablero(MAX, numCasillas, colores, player, pos, casa, casilla, meta, seguros); 
						   
	
	public static void main(String args []){
		for(int i=0;i<MAX;i++) {
			t8.player[i] = new Jugador(colores[i],i);
		}

		t8.rellenar();
		int turno = t8.tirarSalir();
		int i = 0;
		while(!t8.hayGanador()) {
	        //System.out.println("Hello \u001b[1;31mred\u001b[0m world!");
			//MiConsole.println(MiConsole.ANSI_RED, "Texto rojo");
			System.out.println("Jugador: "+turno);
			turno=t8.tirar(turno,0)%8;
			t8.mostrar();
			t8.mostrarJug();
			t8.mostrarMeta();
            i++;
			if(i%10==0) {
				i=0;
			}
			
		}
		t8.mostrar();
		t8.mostrarJug();
		t8.mostrarMeta();
		System.out.println("\n\n");
		/*for(int i=0;i<4;i++) {
			tirar(turno,5);
			System.out.println(mostrar());
			System.out.println(hayGanador());
		}*/
	}
}