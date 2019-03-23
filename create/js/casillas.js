class Casilla{
    constructor(stage,queue,x,y,tipo,numero){
        this.x = x;
        this.y = y;
        this.tipo = tipo;
        this.numero = numero;
        this.imagenes = queue;
        this.contexto = stage;

        this.estaOcupada= false;
        this.fichas = [];
        this.estaIluminada = false;
        this.ilum = null;


        this.ilum = new createjs.Bitmap(this.imagenes.getResult("roja"));
        this.ilum.x = this.x;
        this.ilum.y=this.y;
        this.ilum.alpha=0.0;
        this.contexto.addChild(this.ilum);
    }

    iluminar(color){

        this.estaIluminada=true;

        let nuevoBitMap = new createjs.Bitmap(this.imagenes.getResult(color));
        this.ilum.image = nuevoBitMap.image;
        this.ilum.x = this.x;
        this.ilum.y=this.y;
        createjs.Tween.get(this.ilum,{loop: true}).to({alpha: 0.5}, 300).wait(400).to({alpha: 0.0}, 200);

        //con 2 dados -> 6 posibles casillas de movimienti cada vez...igual no necesario que cada casilla tenga
        //un eventListener click, y que se vayan moviendo por las casillas esos 6 posibles movimientos??***************


    }


}