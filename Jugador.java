package proyecto;

public class Jugador {
	private int numero;
	private int casa;
	private boolean[] casa1;
	private int metidas;
	private String color;
	private boolean hayComp;
	private String comp;
		
	public Jugador(String c, int n) {
		numero = n;
		casa = 4;
		metidas = 0;
		color = c;
		hayComp = false;
	}
	
	public int number() {
		return numero;
	}
	
	public int enCasa() {
		return casa;
	}
	
	public int metidas() {
		return metidas;
	}
	public boolean fin() {
		return metidas()==4;
	}
	public String color() {
		return color;
	}
	
	public void sacar() {
		casa--;
	}
	public void muerta() {
		casa++;
	}
	public void meter() {
		metidas++;
	}
	public void anyadirCOmp(String c) {
		comp = c;
		hayComp = true;
	}
	public boolean esComp(String c) {
		return hayComp && c==comp;
	}
}
