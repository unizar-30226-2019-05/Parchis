class Tablero{
	constructor(max){
		this.MAX = max
		if(this.MAX===4){
			this.numCasillas = 68
			this.colores = ["Rojo","Verde","Amarillo", "Azul"]
			this.seguros = [5,12,17,22,29,34,39,46,51,56,63,68]
		}else if(this.MAX===8){
			this.numCasillas=136
			this.colores = ["Rojo","Verde","Amarillo", "Azul", "Negro", "Violeta", "Cyan", "Blanco"]
			this.seguros = [5,12,17,22,29,34,39,46,51,56,63,68,73,80,85,90,97,102,107,114,119,124,131,136]
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
		this.lastPlayer=0
		this.lastMove=0
		this.esMeta=false
	}

	// Devuelve el estado inicial de la partida pra el alg. mc
	estadoInicial(){
		for(let i=0;i<this.MAX;i++){
			this.player[i]=new Jugador(this.colores[i],i,false)
		}
		this.rellenar()
		let turno = this.tirarSalir()

		return new Estado(pos, casa, meta, turno, [])
	}

	siguienteEstado(estado, jugada){
		this.pos = estado.pos
		this.casa = estado.casa 
		this.meta = estado.meta

		tirar(i.turno, tirada); // TODO

		let nuevoHistorial = estado.historial.slice()
		nuevoHistorial.push(jugada)

		return new Estado(this.pos, this.casa, this.meta, nuevoHistorial)
	}

	// Devuelve las jugadas legales de un jugador para la tirada con valor 'dado'
	jugadasLegales(estado, tirada){ // vectorjugador
		let jugador = estado.turno

		let ficha
		let jugadasLegales = []

		if(tirada == 6 && this.player[jugador].genCasa < 4 && this.comprobarPlayerPuente(jugador, tirada)){ // Hay que romper puente
			ficha  = selecFichaPuente(jugador, tirada);
			if(this.comprobarPos(this.pos[jugador][ficha], tirada, jugador))
			jugadasLegales.push(new Jugada(jugador, ficha, tirada));
			// TODO: En el caso de doble puente también habría que ver si hay otro puente formado
		}
		else if(tirada == 5 && puedeSacar(jugador)){ // Hay que sacar de casa
			ficha = fichaEnCasa(jugador)
			jugadasLegales.push(new Jugada(jugador, ficha, tirada));
		}
		else{ // No hay que romper puente ni salir de casa
			/*for(let i1=0; i1 < this.numFichas; i1++) {
				let po = this.pos[i][i1]-1;
				if(po<0) po=this.numFichas - 1;
				if(this.casa[i][i1]==="FUERA" && this.casilla[po].gpuente() && this.comprobarPos(this.pos[i][i1],value,i)) {
					jugadasLegales.push() = ((this.pos[i][i1]+p)%thi.numCasillas)+1
				}
			}*/
			for(let i1=0; i1 < this.numFichas; i1++) {
				if(this.casa[jugador][i1]==="FUERA" && this.comprobarPos(this.pos[jugador][i1], tirada, jugador)) {
					jugadasLegales.push(new Jugada(jugador, ficha, tirada));
				}
			}
		}

		return jugadasLegales
	}
	
	jugar(){
		while(!this.hayGanador()){
			//console.log("Jugador: "+turno)

			mov = this.montecarlo.bestPlay()
			turno = this.tirar(turno, mov) % this.MAX
			//this.mostrar()
			//this.mostrarJug()
			//this.mostrarMeta()
		}
		
		this.mostrar()
		this.mostrarJug()
		this.mostrarPos()
		this.mostrarMeta()
	}

	mostrarPos(){
		for(let i=0;i<this.MAX;i++){
			console.log("Player: "+i+" origen: " + i*17+ " 1: "+this.pos[i][0]+ " 2: "+this.pos[i][1]+" 3: "+this.pos[i][2]+ " 4: "+this.pos[i][3])
		}
	}

	mostrarJug() {
		for(let i=0;i<this.MAX;i++) {
			let color = this.player[i].gcolor();
			switch(color) {
			case "Azul":
				console.log('%c Metidas: '+this.player[i].gmetidas()+ ' en casa: ' + this.player[i].genCasa(), 'color: blue')
				break;
			case "Amarillo":
				console.log('%c Metidas: '+this.player[i].gmetidas()+ ' en casa: ' + this.player[i].genCasa(), 'color: yellow')
				break;
			case "Verde":
				console.log('%c Metidas: '+this.player[i].gmetidas()+ ' en casa: ' + this.player[i].genCasa(), 'color: green')
				break;
			case "Rojo":
				console.log('%c Metidas: '+this.player[i].gmetidas()+ ' en casa: ' + this.player[i].genCasa(), 'color: red')
				break;
			case "Negro":
				console.log('%c Metidas: '+this.player[i].gmetidas()+ ' en casa: ' + this.player[i].genCasa(), 'color: black')
				break;
			case "Violeta":
				console.log('%c Metidas: '+this.player[i].gmetidas()+ ' en casa: ' + this.player[i].genCasa(), 'color: purple')
				break;
			case "Cyan":
				console.log('%c Metidas: '+this.player[i].gmetidas()+ ' en casa: ' + this.player[i].genCasa(), 'color: cyan')
				break;
			case "Blanco":
				console.log('%c Metidas: '+this.player[i].gmetidas()+ ' en casa: ' + this.player[i].genCasa(), 'color: brown')
				break;
			}

		}
	}

	mostrarMeta() {
		for(let i=0;i<this.MAX;i++) {
			let color = this.player[i].gcolor();
			let show = ''
			for(let y=0;y<this.numMeta;y++) {
				show += (y+1)+': '
				if(this.meta[i][y].gpos1()) {
					show+='X '
				}else {
					show+='- '
				}
			}
			switch(color) {
			case "Azul":
				console.log('%c '+ show,'color: blue')
				break;
			case "Amarillo":
				console.log('%c '+ show,'color: yellow')				
				break;
			case "Verde":
				console.log('%c '+ show,'color: green')
				
				break;
			case "Rojo":
				console.log('%c '+ show,'color: red')
				
				break;
			case "Negro":
				console.log('%c '+ show,'color: black')
				
				break;
			case "Violeta":
				console.log('%c '+ show,'color: pruple')
				
				break;
			case "Cyan":
				console.log('%c '+ show,'color: cyan')
				
				break;
			case "Blanco":
				console.log('%c '+ show,'color: brown')
				break;
			}
		}
	}
	mostrar(){
		let  i = 1;
		let s = new String("");
		this.casilla.forEach( c => {
			let show = "ID:" + i
			if(c.gsalida()) {
				show+=" Seguro: " + c.gcolorSalida()
			}
			if(c.gpos1()) {
				show+=" color1: " + c.gcolor1()
			}
			if(c.gpos2()) {
				show+=" color2: " + c.gcolor2()
			}
			console.log(show)
			i++;
		})		
		return s;
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
	comprobarPlayer(i, value) {
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
			let po = this.pos[i][i1]-1;
			if(po<0) po=this.numFichas - 1;
			if(this.casa[i][i1]=="FUERA" && this.casilla[po].gpuente()) {
				b = b || this.comprobarPos(this.pos[i][i1],value,i);
			}
		}

		return b;
	}


	//Comprueba si puede mover una ficha en pos i a pos i+i2 del jugador p
	comprobarPos(i,i2, p) {
		let b = true;	//No se pasa de su m�ximo
		let aux = false;
		let x = (p*17)%this.numCasillas;
		if(x===0) x = this.numCasillas;
		aux = x>=i && x<(i+i2);
		if(i<=p*17) {
			b = (i+i2)<=(p*17+8);
		}
		b = b && ((aux && x+8>=i+i2) || !aux);
		if(b) {
			for(let y=i;y<(i+i2);y++) {//1 es de la next pos, y el otro del m�dulo
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

	tirar(i,x) {
		let dado = Math.floor(Math.random() * 6) + 1;
		let parejasIguales = false;

		// Scanner teclado = new Scanner(System.in);
		// System.out.print("Introduzca nº: ");
		// tirada = Integer.parseInt(teclado.nextLine());

		//C1: Caso en el que saca tres seises seguidos --- Tres parejas
   		if((this.veces6 == 2 && dado == 6)
			&& (!this.esMeta && this.player[i].genCasa() < 4 && this.casa[i][this.lastMove] == "FUERA")){
			if (this.pos[i][this.lastMove] == 0){
				this.casilla[this.numFichas - 1].sacar(this.player[i].gcolor());
			}
			else{
				this.casilla[this.pos[i][this.lastMove]-1].sacar(this.player[i].gcolor());
			}
			this.casa[i][this.lastMove] = "CASA";
			this.player[i].muerta();
    	}
   		else if(this.player[i].genCasa() > 0) { // C2: Tiene fichas en casa
			//Un dado es 5 (para caso de 1 y 2 dados)
			if(dado===5) { 
				let ficha = this.fichaEnCasa(i);
				let posicionSalida = 5+i*17; //pos de salida
				// Si no hay ya 2 fichas propias en la casilla de salida
				
				if(this.casilla[posicionSalida-1].sePuede(this.player[i].gcolor())) {
					this.procesarSacarCasa(i, ficha, posicionSalida, dado, dado2);
				}
				//No puede sacar de casa aún sacando un 5
				else { 
					this.procesarMover5(i, dado, dado2);
				}
			}
			//Ningún dado ha salido 5 (caso de 1 y 2 dados)
			else { 
				this.procesarTiradaMoverSinSacar(i, dado, dado2);
			}
		}
		else{ // C3: No tiene fichas en casa
			
			this.procesarTiradaMoverSinSacar(i, dado, dado2);
		}

		// Ya no hay que procesar otra tirada; O no hacia falta o ya se ha hecho
		this.otroDado = false;

		if(this.numDados == 1 && dado == 6 && this.veces6 < 2) {
			this.veces6++;
			return i;
		}
		else if(this.numDados == 1){
			this.veces6=0;
			return i+1;
		}
		else if(this.numDados == 2 && !this.otroDado && this.parejasIguales && this.vecesParejas < 2){
			this.vecesParejas++;
			return i;
		}
		else if(this.numDados == 2){
			this.vecesParejas = 0;
			return i+1;
		}
		else{
			return -1;
		}
	}

	procesarTiradaMoverSinSacar(i, dado, dado2){
		let parejasIguales = dado == dado2;
		let sumaDados = dado + dado2;
		// Caso de romper puente
		if(((this.numDados == 1 && dado===6) ||
			(this.numDados == 2 && parejasIguales && !this.otroDado)) && this.hacePuente(i)
			&& this.comprobarPlayerPuente(i, dado)) {
			if(this.numDados == 1) this.movNormal(i, dado, true);
			else this.movNormal(i, sumaDados, true); //TODO: De momento solo rompe puente con el dado
		}
		else if(!this.otroDado && this.comprobarMeta(i, dado)){
			this.movMeta(i, dado);
			if(this.numDados == 2){
				this.otroDado = true;
				this.valorOtroDado = dado2;
				this.tirar(i);
			}
		}
		else if(this.numDados == 2 && this.otroDado && this.comprobarMeta(i, this.valorOtroDado)){
			this.movMeta(i, this.valorOtroDado);
		}
		else if(this.numDados == 2 && !this.otroDado && this.comprobarMeta(i, sumaDados)){
			this.movMeta(i, sumaDados);
		}
		else if(this.numDados == 2 && !this.otroDado && this.comprobarPlayer(i, sumaDados)){
			this.movNormal(i, sumaDados, false);
		}
		else if(!this.otroDado && this.comprobarPlayer(i, dado)){
			this.movNormal(i, dado, false);
			if(this.numDados == 2){
				this.otroDado = true;
				this.valorOtroDado = dado2;
				this.tirar(i);
			}
		}
		else if(this.numDados == 2 && this.otroDado && this.comprobarPlayer(i, this.valorOtroDado)){
			this.movNormal(i, this.valorOtroDado, false);
		}
	}

	procesarMover5( i, dado, dado2){
		if(dado == 5 || (this.otroDado && this.valorOtroDado == 5)){
			if(this.comprobarMeta(i, dado)){
				this.movMeta(i, dado);
			}
			else if(this.comprobarPlayer(i, dado)){
				this.movNormal(i, dado, false);
			}
			// Si hay 2 dados 'volver' a tirar con el segundo dado
			if(this.numDados == 2 && !this.otroDado){
				this.otroDado = true;
				this.valorOtroDado = dado2;
				this.tirar(i);
			}
		}
		else{ // dado2 == 5, 'volver' a tirar con dado
			if(this.comprobarMeta(i, dado2)){
				this.movMeta(i, dado2);
			}
			else if(this.comprobarPlayer(i, dado2)){
				this.movNormal(i , dado2, false);
			}

			this.otroDado = true;
			this.valorOtroDado = dado;
			this.tirar(i);
		}
	}

	procesarSacarCasa( i, ficha, posicion, dado, dado2){
		this.casa[i][ficha]="FUERA"; 
		this.pos[i][ficha]=posicion;
		let s =this.casilla[posicion-1].introducir(this.player[i].gcolor());
		this.player[i].sacar();
		this.lastPlayer = i;
		this.lastMove = ficha;
		this.esMeta = false;
		if(s!="NO") { 
			this.imprimirPosiciones(i);
			this.procesarMatar(i, ficha);
		}

		// Volver a tirar con el otro dado en caso de haberlo
		if ((this.numDados == 2) && (dado == 5) && !this.otroDado){
			this.otroDado = true;
			this.valorOtroDado = dado2;
			this.tirar(i);
		}
		else if ((this.numDados == 2) && (dado2 == 5) && !this.otroDado){
			this.otroDado = true;
			this.valorOtroDado = dado;
			this.tirar(i);
		}
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
			let s = this.casilla[po1].introducir(this.player[i].gcolor());
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
		if(this.pos[i][mejor]==8) {	//ha llegado
			this.casa[i][mejor]="METIDA";
			this.player[i].meter();
			if(this.comprobarPlayer(i,10)) {	//Se ha metido una ficha, se pueden sumar 10
				this.movNormal(i,10,false);
			}
		}else {
			this.meta[i][this.pos[i][mejor]-1].introducir(this.player[i].gcolor());
		}
	}

	entra(i,pos,tirada){
		let origen = i*17
		for(let i=pos;i<=pos+tirada;i++){
			if(origen===(i%this.numCasillas)) return true;
		}
		return false;
	}

	//MovNormal de ficha en el que no tiene fichas en casa
	movNormal( i, tirada, hayPuente) {
		let ficha = 0;
		if(!this.hayPuente){ficha = this.selecFicha(i,tirada);}
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
		if(aux) {	//ha llegado
			this.esMeta = true;
			this.pos[i][ficha]-=cmp;
			v = this.pos[i][ficha];
			if(this.pos[i][ficha]==8) {	//ha llegado
				this.casa[i][ficha]="METIDA";
				this.player[i].meter();
				if(this.comprobarPlayer(i,10)) {	//Se ha metido una ficha, se pueden sumar 10
					this.movNormal(i,10,false);
				}
			}else{
				this.meta[i][v-1].introducir(this.player[i].gcolor());
				this.casa[i][ficha]="META";
			}
			
		}else {
			this.esMeta = false;
			po1 = (this.pos[i][ficha]-1);
			if(po1<0) po1=this.numFichas - 1;
			let s = this.casilla[po1].introducir(this.player[i].gcolor());
			if(s!="NO") {
				this.imprimirPosiciones(i);
				this.muerto(s,this.pos[i][ficha])
				let sePuede = this.comprobarPlayer(i,20);
				while(sePuede) {
					//Comprobar todos los dem�s
					ficha = this.selecFicha(i,20);
					let xx = this.pos[i][ficha]-1;
					//if(xx<0) x=numFichas - 1;
					this.casilla[(xx+this.numCasillas)%this.numCasillas].sacar(this.player[i].gcolor());
					this.pos[i][ficha] = (this.pos[i][ficha] + 20)%this.numCasillas;
					po1 = (this.pos[i][ficha]-1);
					if(po1<0) po1=this.numFichas - 1;
					s=this.casilla[po1].introducir(this.player[i].gcolor());
					sePuede = false;
					if(s!="NO") {
						//Vuelves a matar a alguien
						this.imprimirPosiciones(i);
						this.muerto(s,this.pos[i][ficha])
						sePuede = this.comprobarPlayer(i,20);
					}
				}
			}
		}
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
		let ganador
		for(let i=0;i<this.MAX;i++) {
			hay = hay || this.player[i].fin();
			if (hay) ganador = i
		}
		return [hay, ganador];
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
		for(let i=0;i<this.MAX;i++) {
			for(let y=0;y<this.numFichas;y++) {
				this.casa[i][y] = "CASA";
			}

		}
		for(let y=0;y<this.MAX;y++) {
			for(let i=0;i<this.numMeta;i++) {
				this.meta[y][i] = new Casilla(false,false,this.player[y].gcolor());
			}
		}

		for(let y=0;y<this.numCasillas;y++) {
			let seguro = this.esSeguro(y+1);
			let salida = ((y+13)%17)===0;
			let s = null;
			if (salida) s=this.color(y+1);
			this.casilla[y] = new Casilla(seguro,salida,s);
		}
		console.log(this.casilla)
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