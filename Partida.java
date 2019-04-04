package proyecto;
import java.util.Scanner;

public class Partida {
  public static void main(String[] args){
    try{
      Scanner teclado = new Scanner(System.in);
      System.out.print("Introduzca nº de jugadores (4 u 8): ");
      int numJugadores = Integer.parseInt(teclado.nextLine());
      System.out.print("Introduzca nº de dados (1 o 2): ");
      int numDados = Integer.parseInt(teclado.nextLine());

      Tablero t = new Tablero(numJugadores, numDados);
      t.jugar();
    }
    catch(Exception e){
      System.out.println(e.getMessage());
      e.printStackTrace();
    }
  }
}
