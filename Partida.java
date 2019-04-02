package proyecto;
import java.util.Scanner;

public class Partida {
  public static void main(String[] args){
      Scanner teclado = new Scanner(System.in);
      System.out.print("Introduzca nº de jugadores (4 u 8): ");
      int numJugadores = Integer.parseInt(teclado.nextLine());

      Tablero t = new Tablero(numJugadores);
      t.jugar();
  }
}
