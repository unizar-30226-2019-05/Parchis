class Casilla{
    constructor(stage,queue,x,y,tipo,numero){
        this.x = x;
        this.y = y;
        this.tipo = tipo;
        this.numero = numero;
        this.imagenes = queue;

        //para ocupacion de casilla
        this.estaOcupada= false; //1 ficha en casilla (fichas[0])
        this.estaBarrera= false; //2 fichas en casilla (fichas[0] y [1])
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
        if(this.fichaIlum===null && !this.estaBarrera){ //si no está iluminada parpadeando

            this.fichaIlum=ficha;
            this.ilum.cursor="pointer";

            let nuevoBitMap = new createjs.Bitmap(this.imagenes.getResult(this.fichaIlum.color));
            this.ilum.image = nuevoBitMap.image;

            // si esta ocupada...cambiar x e y***************** y desplazar ficha ocupante
            if(this.estaOcupada && this.fichaIlum!==this.fichas[0]){

                let num = 20;
                if(this.tipo === 'H') {
                    this.ilum.x = this.x + num;
                    this.fichas[0].move(this.x - num,this.y,200);
                }
                else if(this.tipo === 'V') {
                    this.ilum.y= this.y + num;
                    this.fichas[0].move(this.x,this.y - num,200);
                }
            }

            createjs.Tween.get(this.ilum,{loop: true}).to({alpha: 0.5}, 300).wait(400).to({alpha: 0.0}, 200);
        }

    }

    noIluminar(){
        if(this.fichaIlum !== null){ //si esta iluminada parpadeando

            this.fichaIlum = null;
            this.ilum.cursor="default";
            createjs.Tween.removeTweens(this.ilum);

            //por si acaso se para justo mostrandose->ocultarla
            createjs.Tween.get(this.ilum).to({alpha: 0.0}, 300);

            if(this.estaOcupada){

                this.ilum.x = this.x;
                this.ilum.y= this.y;
                this.fichas[0].move(this.x,this.y,200);
            }
        }
    }


}