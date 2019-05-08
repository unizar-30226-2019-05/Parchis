class Casilla{
	constructor(b,b1,s){
		this.seguro=b
		this.salida=b1
		this.colorSalida=s
		this.puente=false
		this.pos1=false
		this.pos2=false
		this.color1=null
		this.color2=null
		this.ultimo=0
	}
	gseguro(){return this.seguro}
	gsalida(){return this.salida}
	gcolorSalida(){return this.colorSalida}
	gpuente(){return this.puente}
	gpos1(){return this.pos1}
	gpos2(){return this.pos2}
	gcolor1(){return this.color1}
	gcolor2(){return this.color2}
	gultimo(){return this.ultimo}
	sePuede(s){
		return !this.pos1 || (this.seguro && !this.pos2) || this.esSalidaSuya(s)
	}
	esValido(s){
		return (!this.pos1 || (this.pos1 && s!==this.color1) || (this.seguro && (!this.pos1 || !this.pos2)))
	}
	//Comprueba si mata
	seMata(s) {
		if(!this.seguro) {
			if(this.pos1 && s!=this.color1) {
				return true;
			}
		}return false;
	}
	esSalidaSuya(s){
		return this.salida && (s===this.colorSalida && (this.color2!==s || this.color1!==s))
	}
	sacar(s){
		if(this.color1===s){
			this.pos1 = false
			this.color1 = null
			if(this.puente) this.puente = false
			this.ultimo=2
		}else{
			this.pos2=false
			this.color2=null
			if(this.puente) this.puente = false
			this.ultimo=1
		}
	}
	introducir(s){
		let muerto = "NO"
		if(!this.pos1 && !this.pos2){
			this.pos1 = true
			this.color1 = s
			this.ultimo = 1
		}else if(this.seguro && !this.pos1){
			this.pos1 = true;
			this.color1 = s;
			this.puente = true;
			this.ultimo = 1;
		} else if(this.seguro && !this.pos2) {	//Pos2 vacía, pero al ser seguro crea puente
			this.pos2 = true;
			this.color2 = s;
			this.puente = true;
			this.ultimo = 2;
		} else if(this.esSalidaSuya(s)) {	//Caso en el que es casilla salida
			if(this.ultimo===1 && s!==this.color1) {
				muerto = this.color1;
				this.color1 = s;
			}else if (this.ultimo===2 && s!==this.color2) {
				muerto = this.color2;
				this.color1 = s;
			}else { // Creo que este else sobraria
				if(s!==this.color1) {
					muerto = this.color1;
					this.color1 = s;			
					this.ultimo = 1;
				}else {
					muerto = this.color2;
					this.color2 = s;
					this.ultimo = 2;
				}
			}
			this.puente = true;

		} else if(!this.seguro && this.pos1) {//Caso en el que se mata sí o sí
			muerto = this.color1;
			this.color1 = s;
			this.ultimo = 1;
		} 
		return muerto;
	}
}

module.exports = Casilla