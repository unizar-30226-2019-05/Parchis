const Casilla = require('./Casilla.js')
const Jugador = require('./Jugador.js')
class Tablero{
	constructor(max,dados,vectcolores,puentes,parejas){
		console.log("Tablero logica creado")
		this.MAX = max
		this.numDados = dados
		this.colores = vectcolores
		this.turno = 0
		this.hayPuente = puentes
		this.porParejas = parejas
		if(this.MAX===4){
			this.numCasillas = 68
			this.seguros = [5,12,17,22,29,34,39,46,51,56,63,68]
		}else if(this.MAX===8){
			this.numCasillas=136
			this.seguros= [5,12,17,22,29,34,39,46,51,56,63,68,73,80,85,90,97,102,107,114,119,124,131,136]
		}
		//aquí error
		this.player = []
		this.casilla = []
		this.pos = []
		for(let i=0;i<this.MAX;i++) this.pos[i]=[]
		this.casa = []
		for(let i=0;i<this.MAX;i++) this.casa[i]=[]
		this.meta = []
		for(let i=0;i<this.MAX;i++) this.meta[i]=[]
		this.numFichas=4
		this.numMeta=8
		this.veces6=0
		this.vecesParejas=0
		this.lastPlayer=0
		this.lastMove=0
		this.esMeta=false
		this.otroDado=false
		this.valorOtroDado=0
		this.haMovido = 0

		this.rellenar()
	}
	getInfo(){
		
		return {
			posicion: this.pos,
			estado: this.casa,
			meta: this.meta
		}
	}
	jugar(){
		
		//this.rellenar()
		let turno = this.tirarSalir()
		while(!this.hayGanador()){
			//console.log("Jugador: "+turno)
			turno = this.tirar(turno,0)%this.MAX
			//this.mostrar()
			//this.mostrarJug()
			//this.mostrarMeta()
		}
		let x = 0
		/*for(let y=0;y<600;y++){
			console.log("Jugador: "+turno)
			turno = this.tirar(turno,y)%this.MAX
			//console.log(this.casilla)
			//this.mostrar()
			//this.mostrarJug()
			this.mostrarMeta()
			//this.mostrarPos()
		}*/
		this.mostrar()
		this.mostrarJug()
		this.mostrarPos()
		this.mostrarMeta()
	}

	setTurno(t){
		this.turno = 0;
	}

	getTurno(){
		let x = this.haMovido
		this.haMovido = false
		return {turno: this.turno, reset: x}
	}

	obtenerDado(){
		return Math.floor((Math.random() * 6) + 1);
	}

	muerto(s,posicion) {
		let noEncontrado = true;
		this.player.forEach( j => {
			if(j.gcolor() === s){
				for(let i=0;i<this.numFichas && noEncontrado;i++) {
					if(this.pos[j.gnumber()][i]===posicion && this.casa[j.gnumber()][i] === "FUERA") {
						this.casa[j.gnumber()][i] = "CASA";
						this.player[j.gnumber()].muerta(); 
						noEncontrado = false;
						this.pos[j.gnumber()][i] = 200;
					}
				}
			}
		})
	}

	//Comprueba que se puede mover dentro de meta
	comprobarPosMeta( i,  pos, total) {
		if(total<9) {
			let si = true;
			for(let y=pos;y<total && si;y++) {
				si = si && this.meta[i][y].esValido(this.player[i].gcolor());
			}
			return si;
		}else return false;
	}

	//Comprueba si hay movimiento en meta
	comprobarMeta( i, value) {
		let b = false;
		for(let i1=0;i1<this.numFichas;i1++) {
			if(this.casa[i][i1]=="META") {
				let posicion = this.pos[i][i1]+value;
				b = b || this.comprobarPosMeta(i,posicion-value,posicion);
			}
		}
		return b;
	}

	//Comprobar movimiento del player, mira todas las fichas
	comprobarPlayer( i, value) {
		let b = false;
		for(let i1=0;i1<this.numFichas;i1++) {
			if(this.casa[i][i1]=="FUERA") {
				b = b || this.comprobarPos(this.pos[i][i1],value,i);
			}
		}

		return b;
	}

	//Comprobar movimiento de los puentes del player
	comprobarPlayerPuente( i, value) {
		let b = false;
		for(let i1=0;i1<this.numFichas;i1++) {
			if(this.casa[i][i1]==="FUERA"){
				let po = this.pos[i][i1]-1;
				if(po<0) po=this.numFichas - 1;
				if(this.casilla[po].gpuente()) {
					b = b || this.comprobarPos(this.pos[i][i1],value,i);
				}
			}
			
		}

		return b;
	}
	

	puedeSacar(i){
		let x = i*17;
		for(let j=0;j<this.numFichas;j++){
			if(this.casa[i][j] === "CASA" && this.casilla[x+4].sePuede(this.player[i].gcolor)) return true;
		}
		return false;
	}

	vectorJugador(i,p){
		let vector = []
		for(let j=0;j<this.numFichas;j++) vector[j] = []

		if((this.numDados === 1 && this.veces6 === 2 && p === 6)
			&& (!this.esMeta && this.player[i].genCasa() < 4 && this.casa[i][this.lastMove] === "FUERA")){
			if (this.pos[i][this.lastMove] === 0){
				this.casilla[this.numFichas - 1].sacar(this.player[i].gcolor());
			}
			else{
				this.casilla[this.pos[i][this.lastMove]-1].sacar(this.player[i].gcolor());
			}
			this.casa[i][this.lastMove] = "CASA";
			this.player[i].muerta();
   		}else{

			let pos = 0

			if(p===5 && this.puedeSacar(i)){
				let x = i*17;
				for(let i1=0;i1<this.numFichas;i1++){
					pos = 0
					if(this.casa[i][i1] === "CASA" && this.casilla[x+4].sePuede(this.player[i].gcolor)){
						vector[i1][pos] = [x+5,"FUERA"]
						pos++
					}
				}
			}
			else if(p===6 && this.hacePuente(i) && this.comprobarPlayerPuente(i,p)){
				console.log("Entro1")
				for(let i1=0;i1<this.numFichas;i1++) {
					pos = 0
					let po = this.pos[i][i1]-1;
					if(po<0) po=this.numFichas - 1;
					if(this.casa[i][i1]==="FUERA" && this.casilla[po].gpuente() && this.comprobarPos(this.pos[i][i1],p,i)) {
						vector[i1][pos] = [((this.pos[i][i1]+p)%this.numCasillas),"FUERA"]
						pos++
						
					}
				}
			}
			else{
				console.log("Entro2 y dado "+p+ "y la i es:"+i)
				for(let i1=0;i1<this.numFichas;i1++) {
					pos=0
					let x = i*17;

					if(p === 5 && this.casilla[x+4].sePuede(this.player[i].gcolor) && this.casa[i][i1] === "CASA"){
						//console.log("Entro3")
						vector[i1][pos] = [x+5,"FUERA"]
						pos++
					}
					else if(this.comprobarPos(this.pos[i][i1],p,i) && this.casa[i][i1] === "FUERA"){
						
						if(x===0)x=this.numCasillas;
						let v = this.pos[i][i1]
						let v1 = (v + p)%this.numCasillas
						let aux = this.entra(i,v,p);

						if(aux){
							if(v===0){
								aux = x+5>=this.numCasillas
							}else aux = x+5>=v
							if(x===this.numCasillas){
								aux = aux && 0<v1
							}else aux = aux && x<v1
						}
						let cmp = i*17;
						if(cmp===0) cmp = 68
						console.log("aux: "+aux)
						console.log(this.pos[i][i1])
						if(aux){
							let v = this.pos[i][i1]-cmp+p
							vector[i1][pos] = [v,"ENTRA"]
							pos++
						}else{
							if((this.pos[i][i1]+p)%this.numCasillas === 0){
								vector[i1][pos] = [68,"FUERA"]
							}else vector[i1][pos] = [((this.pos[i][i1]+p)%this.numCasillas),"FUERA"]
							pos++
						}
						
					}else if(this.casa[i][i1] === "META" && this.comprobarMeta(i,p)){
						vector[i1][pos] = [((this.pos[i][i1]+p)%this.numCasillas),"META"]
						pos++
					}
				}
			}
		}
		if(this.numDados === 1 && p === 6 && this.veces6 < 2) {
			this.veces6++;
			this.turno = (this.turno)%this.MAX;
		}
		else if(this.numDados === 1){
			this.veces6=0;
			this.turno = (this.turno+1)%this.MAX;
		}
		console.log("vect: "+vector)
		return vector
	}

	//Comprueba si puede mover una ficha en pos i a pos i+i2 del jugador p
	comprobarPos(i,i2, p) {
		let b = true;	//No se pasa de su máximo
		let aux = false;
		let x = (p*17)%this.numCasillas;
		if(x===0) x = this.numCasillas;
		aux = x>=i && x<(i+i2);
		if(i<=p*17) {
			b = (i+i2)<=(p*17+8);
		}
		b = b && ((aux && x+8>=i+i2) || !aux);
		if(b) {
			for(let y=i;y<(i+i2);y++) {//1 es de la next pos, y el otro del módulo
				if(!aux||(y-x)<0) {
					b = b && !this.casilla[y%this.numCasillas].gpuente();
				}else b = b && !this.meta[p][y-x].gpos1();
			}
			if(!aux) {
				b = b && this.casilla[(i+i2-1)%this.numCasillas].esValido(this.player[p].gcolor());
			}
		}
		return b;
	}

	//Comprueba si en esa posición se mataría
	seMata( posicion, s) {
		let pos = posicion-1;
		if(posicion===0) pos=this.numFichas - 1;
		return this.casilla[pos].seMata(s);
	}


	selecFichaPuente( i, value) {
		let mejor = 0;
		let recorrido = 500;
		let mata = false;
		for(let i1=0;i1<this.numFichas;i1++) {
			let po = this.pos[i][i1]-1;
			if(po<0) po=this.numFichas - 1;
			if(this.casa[i][i1]==="FUERA" && this.casilla[po].gpuente() && this.comprobarPos(this.pos[i][i1],value,i)) {
				let v = pos[i][i1];
				if(!mata && this.seMata((v+value)%this.numCasillas,this.player[i].gcolor())){
					mejor = i1;
					mata = true;
					recorrido = ((i*17%numCasillas+1)-v+value)%this.numCasillas;
				}else if(mata && this.seMata((v+value)%this.numCasillas,this.player[i].gcolor())) {
					let recorridoNew = ((i*17%this.numCasillas+1)-v+value)%this.numCasillas;
					if(recorridoNew<recorrido) {
						mejor = i1;
						mata = true;
						recorrido = ((i*17%this.numCasillas+1)-v+value)%this.numCasillas;
					}
				}else if(!mata) {
					let recorridoNew = ((i*17%this.numCasillas+1)-v+value)%this.numCasillas;
					if(recorridoNew<recorrido) {
						mejor = i1;
						mata = true;
						recorrido = ((i*17%this.numCasillas+1)-v+value)%this.numCasillas;
					}
				}
			}
		}
		return mejor;
	}

	//Seleccionar cual debe mover
	selecFicha( i, value) {
		let mata = false;
		let meta = false;
		let aux;
		let mejor = 0;
		let recorrido = 500;
		let x = i*17;
		if(x===0)x=this.numCasillas;
		for(let i1=0;i1<this.numFichas;i1++) {
			if(this.casa[i][i1]==="FUERA") {
				let v = this.pos[i][i1];
				aux = x>=v && x<(v+value);
				if(this.comprobarPos(v, value, i)) {
					if(aux) {
						let recAux = 8-((v+value)-i*17);
						if(!meta) {
							mejor = i1;
							recorrido = recAux;
							meta = true;
						}else if(recAux<recorrido) {
							mejor = i1;
							recorrido = recAux;
						}
					}else if(!mata && this.seMata((v+value)%this.numCasillas,this.player[i].gcolor())) {
						mejor = i1;
						mata = true;
						recorrido = ((i*17%this.numCasillas+1)-v+value)%this.numCasillas;
					}else if(mata && this.seMata((v+value)%this.numCasillas,this.player[i].gcolor())) {
						let recorridoNew = ((i*17%this.numCasillas+1)-v+value)%this.numCasillas;
						if(recorridoNew<recorrido) {
							mejor = i1;
							mata = true;
							recorrido = ((i*17%this.numCasillas+1)-v+value)%this.numCasillas;
						}
					}else if(!mata) { 
						let recorridoNew = ((i*17%this.numCasillas+1)-v+value)%this.numCasillas;
						if(recorridoNew<recorrido) { 
							mejor = i1;
							mata = true;
							recorrido = ((i*17%this.numCasillas+1)-v+value)%this.numCasillas;
						}
					}
				}
			}
		}
		return mejor;
	}

	//Cuenta el nº de puentes que tiene un jugador
	contarPuentes( i) {
		let total = 0;
		for(let i1=0;i1<this.numFichas;i1++) {
			let po = this.pos[i][i1]-1;
			if(po<0) po=this.numFichas - 1;
			if(this.casa[i][i1]==="FUERA" && this.casilla[po].gpuente()) {
				total++;
			}
		}
		return total;
	}

	//Comprueba si un jugador tiene puente
	hacePuente( i) {
		let b = false;
		for(let i1=0; i1 < this.numFichas; i1++) {
			let po = this.pos[i][i1]-1;
			if(po<0) po = this.numCasillas - 1; //TODO REVISAR
			if(this.casa[i][i1]==="FUERA") {
				b = b || this.casilla[po].gpuente();
			}
		}
		return b;
	}


	tirar(i,dado1,dado2){
		let parejasIguales = (dado1==dado2)
		if(!this.otroDado && ((this.numDados == 1 && this.veces6 == 2 && dado1 == 6)
			|| (this.numDados == 2 && !this.otroDado && this.vecesParejas == 2 && parejasIguales))
			&& (!this.esMeta && this.player[i].genCasa() < 4 && this.casa[i][this.lastMove] == "FUERA")){
			if (this.pos[i][this.lastMove] == 0){
				this.casilla[this.numFichas - 1].sacar(this.player[i].gcolor());
			}
			else{
				this.casilla[this.pos[i][this.lastMove]-1].sacar(this.player[i].gcolor());
			}
			this.casa[i][this.lastMove] = "CASA";
			this.player[i].muerta();
			return null
		}
		else if(this.player[i].genCasa() > 0) { // C2: Tiene fichas en casa
			this.otroDado = false;
			if(this.numDados == 1 && dado1 == 6 && this.veces6 < 2) {
				this.veces6++;
			}
			else if(this.numDados == 1){
				this.veces6=0;
				this.turno = (this.turno+1)%this.MAX;
			}
			else if(this.numDados == 2 && !this.otroDado && this.parejasIguales && this.vecesParejas < 2){
				this.vecesParejas++;
			}
			else if(this.numDados == 2){
				this.vecesParejas = 0;
				this.turno = (this.turno+1)%this.MAX;
			}
			//Un dado es 5 (para caso de 1 y 2 dados)
			if(dado1===5 || (this.numDados == 2 &&
				(dado2 == 5 || (this.otroDado && this.valorOtroDado == 5))) ) { 
				let ficha = this.fichaEnCasa(i);
				let posicionSalida = 5+i*17; //pos de salida
				// Si no hay ya 2 fichas propias en la casilla de salida
				if(this.casilla[posicionSalida-1].sePuede(this.player[i].gcolor())) {
					return this.procesarSacarCasa(i, ficha, posicionSalida, dado1, dado2);
				}
				//No puede sacar de casa aún sacando un 5
				else { 
					return this.procesarMover5(i, dado1, dado2);
				}
			}
			//Ningún dado ha salido 5 (caso de 1 y 2 dados)
			else { 
				return this.procesarTiradaMoverSinSacar(i, dado1, dado2);
			}
		}
		else{ // C3: No tiene fichas en casa
			this.otroDado = false;
			if(this.numDados == 1 && dado1 == 6 && this.veces6 < 2) {
				this.veces6++;
			}
			else if(this.numDados == 1){
				this.veces6=0;
				this.turno = (this.turno+1)%this.MAX;
			}
			else if(this.numDados == 2 && !this.otroDado && this.parejasIguales && this.vecesParejas < 2){
				this.vecesParejas++;
			}
			else if(this.numDados == 2){
				this.vecesParejas = 0;
				this.turno = (this.turno+1)%this.MAX;
			}
			return this.procesarTiradaMoverSinSacar(i, dado1, dado2);
		}
	}

	procesarTiradaMoverSinSacar(i, dado1, dado2){
		let parejasIguales = dado1 == dado2;
		let sumaDados = dado1 + dado2;
		// Caso de romper puente
		if(((this.numDados == 1 && dado1===6) ||
			(this.numDados == 2 && parejasIguales && !this.otroDado)) && this.hacePuente(i)
			&& this.comprobarPlayerPuente(i, dado1)) {
			if(this.numDados == 1) return this.movNormal(i, dado1, true);
			else return this.movNormal(i, sumaDados, true); //TODO: De momento solo rompe puente con el dado1
		}
		else if(!this.otroDado && this.comprobarMeta(i, dado1)){
			return this.movMeta(i, dado1);
			/*if(this.numDados == 2){
				this.otroDado = true;
				this.valorOtroDado = dado2;
				this.tirar(i);
			}*/
		}
		else if(this.numDados == 2 && this.otroDado && this.comprobarMeta(i, this.valorOtroDado)){
			return this.movMeta(i, this.valorOtroDado);
		}
		else if(this.numDados == 2 && !this.otroDado && this.comprobarMeta(i, sumaDados)){
			return this.movMeta(i, sumaDados);
		}
		else if(this.numDados == 2 && !this.otroDado && this.comprobarPlayer(i, sumaDados)){
			return this.movNormal(i, sumaDados, false);
		}
		else if(!this.otroDado && this.comprobarPlayer(i, dado1)){
			return this.movNormal(i, dado1, false);
			/*if(this.numDados == 2){
				this.otroDado = true;
				this.valorOtroDado = dado2;
				this.tirar(i);
			}*/
		}
		else if(this.numDados == 2 && this.otroDado && this.comprobarPlayer(i, this.valorOtroDado)){
			return this.movNormal(i, this.valorOtroDado, false);
		}
	}

	procesarMover5( i, dado1, dado2){
		if(dado1 == 5 || (this.otroDado && this.valorOtroDado == 5)){
			if(this.comprobarMeta(i, dado1)){
				return this.movMeta(i, dado1);
			}
			else if(this.comprobarPlayer(i, dado1)){
				return this.movNormal(i, dado1, false);
			}
			// Si hay 2 dados 'volver' a tirar con el segundo dado
			/*if(this.numDados == 2 && !this.otroDado){
				this.otroDado = true;
				this.valorOtroDado = dado2;
				this.tirar(i);
			}*/
		}
		else{ // dado2 == 5, 'volver' a tirar con dado1
			if(this.comprobarMeta(i, dado2)){
				return this.movMeta(i, dado2);
			}
			else if(this.comprobarPlayer(i, dado2)){
				return this.movNormal(i , dado2, false);
			}

			this.otroDado = true;
			this.valorOtroDado = dado1;
			//this.tirar(i);
		}
	}

	procesarSacarCasa( i, ficha, posicion, dado1, dado2){
		this.casa[i][ficha]="FUERA"; 
		this.pos[i][ficha]=posicion;
		let s = this.casilla[posicion-1].introducir(this.player[i].gcolor(),this.player[(i+this.MAX/2)%this.MAX].gcolor())
		this.player[i].sacar();
		this.lastPlayer = i;
		this.lastMove = ficha;
		this.esMeta = false;
		let devolver = {ficha: ficha, pos: posicion, accion: null, estado: "FUERA"}
		if(s!="NO") { 
			this.imprimirPosiciones(i);
			this.procesarMatar(i, ficha);
			devolver.accion = "mata"
		}
		this.haMovido = true
		return devolver;
		// Volver a tirar con el otro dado en caso de haberlo
		/*if ((this.numDados == 2) && (dado1 == 5) && !this.otroDado){
			this.otroDado = true;
			this.valorOtroDado = dado2;
			this.tirar(i);
		}
		else if ((this.numDados == 2) && (dado2 == 5) && !this.otroDado){
			this.otroDado = true;
			this.valorOtroDado = dado1;
			this.tirar(i);
		}*/
	}

	procesarMatar( i, ficha){
		let sePuede = this.comprobarPlayer(i,20);
		while(sePuede) {
			//Comprobar todos los demás
			ficha = this.selecFicha(i,20);
			let xx = this.pos[i][ficha]-1;
			if(xx<0) xx=this.numFichas - 1;
			this.casilla[xx].sacar(this.player[i].gcolor());
			this.pos[i][ficha] = (this.pos[i][ficha] + 20)%this.numCasillas;
			let po1 = (this.pos[i][ficha]-1);
			if(po1<0) po1=this.numFichas - 1;
			let s = this.casilla[po1].introducir(this.player[i].gcolor(),this.player[(i+this.MAX/2)%this.MAX].gcolor());
			sePuede = false;
			let posicion = this.pos[i][ficha];
			if(s!="NO") {
				//Vuelves a matar a alguien
				this.imprimirPosiciones(i);
				this.muerto(s,posicion)
				sePuede = this.comprobarPlayer(i,20);
			}
		}
	}


	movMeta( i,  tirada) {
		let mejor = 0;
		let resta = 100;
		for(let i1=0;i1<this.numFichas;i1++) {
			if(this.casa[i][i1]=="META") {
				let total = this.pos[i][i1]+tirada;
				if(this.comprobarPosMeta(i,this.pos[i][i1],total)) {
					if(resta>(8-total)) {
						mejor = i1;
						resta = 8-total;
					}
				}
			}
		}
		let v = this.pos[i][mejor];
		this.meta[i][this.pos[i][mejor]-1].sacar(this.player[i].gcolor());
		this.pos[i][mejor]+=tirada;
		this.lastPlayer = i;
		this.lastMove = mejor;
		this.esMeta = true;
		let devolver = {mejor: ficha, pos: this.pos[i][mejor], accion: null, estado: "META"}
		if(this.pos[i][mejor]==8) {	//ha llegado
			this.casa[i][mejor]="METIDA";
			this.player[i].meter();
			devolver.accion = "METIDA"
		}else {
			this.meta[i][this.pos[i][mejor]-1].introducir(this.player[i].gcolor(), this.player[(i+this.MAX/2)%this.MAX].gcolor());
		}
		this.haMovido = true
		return devolver
	}

	entra(i,pos,tirada){

		let origen = i*17
		for(let i=pos;i<=(pos+tirada);i++){
			if(origen===(i%this.numCasillas)) return true;
		}
		return false;
	}

	//movJugador indicando la casilla a donde mueve, entra indica si entra en la meta o no
	movJugadorCasilla(i,ficha,casilla,entra){

		
		
		if(this.casa[i][ficha] === "FUERA" || this.casa[i][ficha] === "META"){
			let po1 = (this.pos[i][ficha]-1);
			if(po1<0) po1=this.numFichas - 1;
			this.casilla[po1].sacar(this.player[i].gcolor());
		}

		this.pos[i][ficha] = casilla;
		if(entra == "meta"){
			if(this.pos[i][ficha]==8) {	//ha llegado
				this.casa[i][ficha]="METIDA";
				this.player[i].meter();
				this.haMovido = true
				return {accion: "meta", vector: tableroLogica.vectorJugador(i,10), color: this.player[i].gcolor(),estado: "META"}
			}else{
				this.meta[i][this.pos[i][ficha]-1].introducir(this.player[i].gcolor(),this.player[(i+this.MAX/2)%this.MAX].gcolor());
				this.casa[i][ficha]="META";
				this.haMovido = true
				return {accion: "nada", estado:"META"}
			}
		}else{
			
			let po2 = (this.pos[i][ficha]-1);
			if(po2<0) po1=this.numFichas - 1;
			let s = this.casilla[po2].introducir(this.player[i].gcolor(), this.player[(i+this.MAX/2)%this.MAX].gcolor());
			if(this.casa[i][ficha]="CASA") this.casa[i][ficha]="FUERA";

			if(s!="NO") {
				this.muerto(s,this.pos[i][ficha])

			this.haMovido = true
				//ACTUALIZAR ESTADO DE LA FICHA MUERTA A CASA .... ********************************************************
				return {accion: "mata", vector: tableroLogica.vectorJugador(i,20), color: this.player[i].gcolor(),estado: "FUERA"}
			}

			this.haMovido = true
			return {accion: "nada",estado: "FUERA"}
		}
	}

	//MovNormal de ficha en el que no tiene fichas en casa
	movNormal( i, tirada, hayPuente) {
		let ficha = 0;
		if(!hayPuente){ficha = this.selecFicha(i,tirada);}
		else ficha = this.selecFichaPuente(i,tirada);
		let po1 = (this.pos[i][ficha]-1);
		if(po1<0) po1=this.numFichas - 1;
		this.casilla[po1].sacar(this.player[i].gcolor());
		let v = this.pos[i][ficha];
		this.pos[i][ficha] = (this.pos[i][ficha]+tirada)%this.numCasillas;
		this.lastPlayer = i;
		this.lastMove = ficha;
		let x = i*17;

		if(x===0)x=this.numCasillas;
		let aux = this.entra(i,v,tirada);
		if(aux){
			if(v===0){
				aux = x+5>=this.numCasillas
			}else aux = x+5>=v
			if(x===this.numCasillas){
				aux = aux && 0<this.pos[i][ficha]
			}else aux = aux && x<this.pos[i][ficha]
		}
		
		//console.log("es: "+aux)
		let cmp = i*17;
		v = this.pos[i][ficha];
		//if(i===0)cmp = numCasillas;
		let devolver = {ficha: ficha, pos: this.pos[i][ficha], accion: null, estado: "FUERA"}
		
		if(aux) {	//ha llegado
			this.esMeta = true;
			devolver.estado = "META"
			this.pos[i][ficha]-=cmp;
			v = this.pos[i][ficha];
			if(this.pos[i][ficha]==8) {	//ha llegado
				this.casa[i][ficha]="METIDA";
				this.player[i].meter();
				devolver.accion = "METIDA"
			}else{
				this.meta[i][v-1].introducir(this.player[i].gcolor(),this.player[(i+this.MAX/2)%this.MAX].gcolor());
				this.casa[i][ficha]="META";
			}
			
		}else {
			this.esMeta = false;
			po1 = (this.pos[i][ficha]-1);
			if(po1<0) po1=this.numFichas - 1;
			let s = this.casilla[po1].introducir(this.player[i].gcolor(),this.player[(i+this.MAX/2)%this.MAX].gcolor());
			if(s!="NO") {
				devolver.accion = "mata"
				this.imprimirPosiciones(i);
				this.muerto(s,this.pos[i][ficha])
			}
		}
		
		this.haMovido = true
		return devolver;
	}

	//Devuelve la primera ficha que encuentre que está en casa
	fichaEnCasa( i) {
		let y = 0;
		while(y<this.numFichas && this.casa[i][y] !="CASA") y++;
		return y;
	}
	//Detectar si alguien ha acabado
	hayGanador() {
		let hay = false;
		for(let i=0;i<this.MAX;i++) {
			if(this.porParejas){
				hay = hay || (this.player[i].fin() && this.player[(i+this.MAX/2)%this.MAX]);
			}else hay = hay || this.player[i].fin();
		}
		return hay;
	}

	//Para determinar quien empieza automaticamente
	tirarSalir() {
		let tirada = [];
		for(let y=0;y<this.MAX;y++) {
			tirada[y] = Math.floor(Math.random() * 6) + 1
		}
		let mayor = tirada[0];
		let pos = 0;
		for(let y=1;y<this.MAX;y++) {
			if(mayor<tirada[y]) {
				mayor = tirada[y];
				pos = y;
			}
		}
		return pos;
	}

	//Devuelve si una pos es segurp
	esSeguro(y) {
		let x = false
		for(let i=0;i<this.numCasillas;i++){
			if(this.seguros[i]===y) x = true
		}
		return x
	}

	//Inicializar fichas
	rellenar() {
		for(let i=0;i<this.MAX;i++){
			if(this.porParejas){
				let s = (i+this.MAX/2)%this.MAX
				if(this.MAX===4){
					console.log((i+2)%this.MAX)
					this.player[i]=new Jugador(this.colores[i],i,true,this.colores[s])
				}else this.player[i]=new Jugador(this.colores[i],i,true,this.colores[s])
			}else this.player[i]=new Jugador(this.colores[i],i,false,null)
		}

		for(let i=0;i<this.MAX;i++) {
			for(let y=0;y<this.numFichas;y++) {
				this.casa[i][y] = "CASA";
				this.pos[i][y] = 1;
			}

		}
		for(let y=0;y<this.MAX;y++) {
			for(let i=0;i<this.numMeta;i++) {
				this.meta[y][i] = new Casilla(false,false,this.player[y].gcolor(),this.hayPuente, this.porParejas);
			}
		}

		for(let y=0;y<this.numCasillas;y++) {
			let seguro = this.esSeguro(y+1);
			let salida = ((y+13)%17)===0;
			let s = null;
			if (salida) s=this.color(y+1);
			this.casilla[y] = new Casilla(seguro,salida,s,this.hayPuente, this.porParejas);
		}
		
	}

	//Busca color al que pertenece la salida
	color( y) {
		let pos = (y+12)/17-1;
		return this.colores[pos];
	}

	// Para depurar
	imprimirPosiciones(p) {
		let i = 0;
		while(i < this.numFichas){
			i++;
		}
	}
}

module.exports = Tablero
