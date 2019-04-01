package proyecto;
import java.util.Random;
import java.util.Scanner;

public class Tablero4{
	private static int MAX = 4;
	private static int numCasillas = 68;
	private static int numFichas = 4;
    private static int numMeta = 8;
	private static String[] colores = {"Rojo","Verde","Amarillo", "Azul"};
	static Jugador[] player = new Jugador[MAX];
	static int[][] pos = new int[MAX][numFichas];
	static String[][] casa = new String[MAX][numFichas];
	static Casilla[] casilla = new Casilla[numCasillas];
	static Casilla[][] meta = new Casilla[MAX][numMeta];
	static int[] seguros= {5,12,17,22,29,34,39,46,51,56,63,68};
	private static Tablero t4 = new Tablero(MAX, numCasillas, numFichas, colores, player, pos, casa, casilla, meta, seguros); 
	
    public static void main(String args []){
		for(int i=0;i<MAX;i++) {
			t4.player[i] = new Jugador(colores[i],i);
		}

		t4.rellenar();
		int turno = t4.tirarSalir();
		// int turno = 0;
		int i = 0;
		while(!t4.hayGanador()) {
			System.out.println("Jugador: "+turno);
			turno=t4.tirar(turno,0)%MAX;
			t4.mostrar();
			t4.mostrarJug();
			t4.mostrarMeta();
            i++;
			if(i%10==0) {
				i=0;
			}
			
		}
		t4.mostrar();
		t4.mostrarJug();
		t4.mostrarMeta();
		System.out.println("\n\n");
		/*for(int i=0;i<4;i++) {
			tirar(turno,5);
			System.out.println(mostrar());
			System.out.println(hayGanador());
		}*/
	}
}