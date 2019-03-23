class Casilla{
    constructor(stage,queue,x,y,tipo,numero){
        this.x = x;
        this.y = y;
        this.tipo = tipo;
        this.numero = numero;
        this.imagenes = queue;

        //para ocupacion de casilla
        this.estaOcupada= false;
        this.fichas = [];

        //para mostrar posibles movimientos en casilla
        this.fichaIlum = null; //ficha con posible movimiento y casilla iluminada o no
        this.ilum = new createjs.Bitmap(); //bitmap vacio
        this.ilum.x = this.x;
        this.ilum.y = this.y;
        this.ilum.alpha=0.0;

        stage.addChild(this.ilum);

        this.ilum.addEventListener("click", () => {
            if(this.fichaIlum !== null){
                //callback a ficha
                this.fichaIlum.realizarMovimientoElegido(this);
            }
        });
    }

    iluminar(ficha){
        if(this.fichaIlum===null){ //si no está iluminada parpadeando

            this.fichaIlum=ficha;
            this.ilum.cursor="pointer";

            let nuevoBitMap = new createjs.Bitmap(this.imagenes.getResult(this.fichaIlum.color));
            this.ilum.image = nuevoBitMap.image;

            // si esta ocupada...cambiar x e y*****************
            this.ilum.x = this.x;
            this.ilum.y=this.y;

            createjs.Tween.get(this.ilum,{loop: true}).to({alpha: 0.5}, 300).wait(400).to({alpha: 0.0}, 200);
        }

        //con 2 dados y 4 fichas-> 12 posibles casillas de movimienti cada vez...igual no necesario que cada casilla tenga
        //un eventListener click, y que se vayan moviendo por las casillas esos 6 posibles movimientos??***************

    }

    noIluminar(){
        if(this.fichaIlum !== null){ //si esta iluminada parpadeando

            this.fichaIlum = null;
            this.ilum.cursor="default";
            createjs.Tween.removeTweens(this.ilum);

            //por si acaso se para justo mostrandose->ocultarla
            createjs.Tween.get(this.ilum).to({alpha: 0.0}, 300);
        }
    }


}