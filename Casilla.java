package proyecto;

public class Casilla {
	private boolean seguro;
	private boolean salida;
	private String colorSalida;
	private boolean puente;
	private boolean pos1;
	private boolean pos2;
	private String color1;
	private String color2;
	private int ultimo;
	
	public Casilla(boolean b, boolean b1, String s) {
		seguro = b;
		salida = b1;
		colorSalida = s;
		puente = false;
		pos1 = false;
		pos2 = false;
		color1 = new String();
		color2 = new String();
		ultimo = 0;
	}
	
	public boolean seguro() {
		return seguro;
	}
	public boolean salida() {
		return salida;
	}
	public boolean puente() {
		return puente;
	}
	public boolean pos1() {
		return pos1;
	}
	public boolean pos2() {
		return pos2;
	}
	public String color1() {
		return color1;
	}
	public String color2() {
		return color2;
	}
	public String colorSalida() {
		return colorSalida;
	}
	//Comprueba si hay movimiento posible sin matar------NO SE SI TIENE UTILIDAD
	public boolean sePuede(String s) {
		return !pos1 || (seguro && !pos2) || esSalidaSuya(s);
	}
	public boolean esValido(String s) {
		return (!pos1 || (pos1 && s!=color1));
	}
	//COmprueba si mata
	public boolean seMata(String s) {
		if(!seguro) {
			if(pos1 && s!=color1) {
				return true;
			}
		}return false;
	}
	//Comprueba si esta casilla es de salida
	public boolean esSalidaSuya(String s) {
		return salida && (s==colorSalida && (color2!=s || color1!=s));
	}
	public String introducir(String s) {
		String muerto ="NO";
		if(!pos1()) {	//Pos1 vacía
			pos1 = true;
			color1 = s;
			ultimo = 1;
			if(seguro && pos2) puente = true;
		}else if(seguro && !pos2) {	//Pos2 vacía pero tiene que ser seguro
			pos2 = true;
			color2 = s;
			puente = true;
			ultimo = 2;
		}else if(esSalidaSuya(s)) {	//Caso en el que es casilla salida
			if(ultimo==1 && s!=color1) {
				muerto = color1;
				color1 = s;
			}else if (ultimo==2 && s!=color2) {
				muerto = color2;
				color1 = s;
			}else {
				if(s!=color1) {
					muerto = color1;
					color1 = s;			
					ultimo = 1;
				}else {
					muerto = color2;
					color2 = s;
					ultimo = 2;
				}
			}
		} else if(!seguro && pos1) {//Caso en el que se mata sí o sí
			muerto = color1;
			color1 = s;
			ultimo = 1;
		}
		return muerto;
	}
	//Función de sacar ficha
	public void sacar(String s) {
		if(color1==s) {
			pos1 = false;
			color1 = "";
			if(puente) puente = false;
			ultimo = 2;
		}else {
			System.out.println("OUT");
			pos2 = false;
			color2 ="";
			if(puente) puente = false;
			ultimo = 1;
		}
	}
}
