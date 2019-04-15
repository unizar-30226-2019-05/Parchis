class Jugador{
	construct(c,n){
		this.numero=n
		this.casa=4
		this.metidas=0
		this.color=c
		this.hayComp=false
		this.comp=null
	}
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