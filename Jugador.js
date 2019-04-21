class Jugador{
	constructor(c,n){
		this.numero=n
		this.casa=4
		this.metidas=0
		this.color=c
		this.hayComp=false
		this.comp=null
		this.esPlayer=false
	}
	constructor(c,n,e){
		this.numero=n
		this.casa=4
		this.metidas=0
		this.color=c
		this.hayComp=false
		this.comp=null
		this.esPlayer=e
	}
	gesPlayer(){ return this.esPlayer}
	gnumber(){ return this.numero}
	genCasa(){return this.casa}
	gmetidas(){return this.metidas}
	fin(){return this.metidas === 4}
	gcolor(){return this.color}
	sacar(){this.casa--}
	muerta(){this.casa++}
	meter(){this.metidas++}
	anyadirComp(c){this.comp=c;this.hayComp=true}
	esComp(c){return this.hayComp && c === this.comp}
	gcomp(){return this.comp}
}