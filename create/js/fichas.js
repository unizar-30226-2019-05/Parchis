class Ficha{
    constructor(stage,queue,color,casilla,listeners,esc,numero,casillasCampo,casillasCasa,fichasTot){
        this.casilla = casilla;
        this.casilla.estaOcupada=true;
        this.casilla.fichas[0]=this;
        this.color = color;
        this.imagenes = queue;
        this.numero = numero;

        //mirar de hacer acceso a casillas y fichas desde game y no desde clase fichaa???***********
        this.casillasCampo = casillasCampo;
        this.casillasCasa = casillasCasa;
        this.fichasTot = fichasTot;
        //***************************************************************************************

        this.token = new createjs.Bitmap(this.imagenes.getResult(this.color));
        this.token.x = this.casilla.x;
        this.token.y = this.casilla.y;
        this.token.scaleX = this.token.scaleY = esc;

        this.escalaReal = esc;
        this.enMovimiento = false;
        this.seleccionada = false;


        //solo para probar, los movs hay que solicitarlos al servidor**********************
        //BORRAR
        this.posiblesMovs = [
            [39,45,60,20], //para ficha 0
            [48,56,67,10], //para ficha 1
            [5,30,51,64], //para ficha 2
            [12,57,41,28] //para ficha 3
        ];

        //**********************************************************************************


        stage.addChild(this.token);

        if(listeners){

            this.imgClick = new createjs.Bitmap(this.imagenes.getResult(this.color+"Click")).image;
            this.imgNormal = new createjs.Bitmap(this.imagenes.getResult(this.color)).image;

            this.token.addEventListener("click", () => {
                if(!this.enMovimiento && !this.seleccionada){

                    this.seleccionada = true;
                    createjs.Tween.get(this.token)
                        .to({alpha: 0.4},200)
                        .to({image: this.imgClick},50)
                        .to({alpha: 1.0},200);


                    this.mostrarMovimientos(); //llamar con web sockets,crear vector real........****************

                    //y ocultar los movs del resto si hubiera alguna activo, a modo de switch en la selección
                    this.fichasTot[this.color].forEach((f,i) =>{
                        if(i!==this.numero) f.ocultarMovimientos(true);
                    })


                } else if (!this.enMovimiento && this.seleccionada){

                    this.ocultarMovimientos(false);
                }

            });
            this.token.addEventListener("mouseover", () => {
                //agrandar si pasa por encima el cursor
                if(!this.enMovimiento){
                    let incr = 0.1;
                    this.token.cursor = "pointer";
                    createjs.Tween.get(this.token)
                        .to({scaleX: this.escalaReal + incr, scaleY: this.escalaReal + incr},200);
                    //this.token.scaleX+=incr; this.token.scaleY+=incr; //no animado
                }
            });
            this.token.addEventListener("mouseout", () => {
                //volver a estado normal si el cursor ya no pasa por encima
                if(!this.enMovimiento && !this.seleccionada){
                    createjs.Tween.get(this.token)
                        .to({scaleX: this.escalaReal, scaleY: this.escalaReal},200);
                    //this.token.scaleX-=incr; this.token.scaleY-=incr; //no animado
                }
            });
        }
    }

    moveC(casilla){
        //si esta ocupada .... mover posiciones  ....**************************************************+
        this.token.x = casilla.x;
        this.token.y = casilla.y;
        this.token.scaleX = this.token.scaleY = 1.0;
        this.escalaReal=1.0;

        //falta tema barreras ... si hay 2 fichas*******************************************************+
        //dejamos la actual como libre otra vez
        this.casilla.estaOcupada=false;
        this.casilla.fichas[0]=null;
        //ocupamos la nueva
        this.casilla = casilla;
        this.casilla.estaOcupada = true;
        this.casilla.fichas[0] = this;
    }

    componerRuta(casillas,desde,hasta){
        let casillasMov = [];
        let i = 0;

        if(desde === 0){ //ficha en casa
            let nSalida = 5; //amarilla
            if(this.color === "azul") nSalida = 22;
            if(this.color === "roja") nSalida = 39;
            if(this.color === "verde") nSalida = 56;

            casillasMov[i] = casillas[nSalida]; i++;
            desde = nSalida;
        }

        for(let j=desde+1;j<=hasta;j++){
            casillasMov[i] = casillas[j];
            i++;
        }
        if(hasta < desde){
            for(let j=desde+1;j<=68;j++){
                casillasMov[i] = casillas[j];
                i++;
            }
            for(let j=1; j<=hasta;j++){
                casillasMov[i] = casillas[j];
                i++;
            }
        }
        return casillasMov;
    }

    move(mx,my,velocidad){
        createjs.Tween.get(this.token)
            .to({x: mx, y: my, scaleX: 1.0, scaleY: 1.0}, velocidad);
    }


    moveAnimate(casillas,hasta, velocidad){

        this.enMovimiento = true;
        this.token.cursor = "default";
        this.escalaReal=1.0;

        let casillasMov = this.componerRuta(casillas,this.casilla.numero, hasta);


        //si la casilla actual esta ocupada por dos y esta ficha se va, retornar la otra al medio de la casilla*************************************



        let self = this;
        function mover(casillas,i,velocidad){

            if(i<casillas.length){

                //Si casilla anterior ocupada(i-1) mover al medio de la casilla su ficha.
                //Si la casilla a la que se va a mover ahora esta ocupada,desviar a la izquierda
                //la ficha que lo ocupa y pasar desviando por la derecha
                if(i>0 && casillas[i-1].estaOcupada){
                    casillas[i-1].fichas[0].move(casillas[i-1].x,casillas[i-1].y,velocidad);
                }

                let mx = casillas[i].x,
                    my = casillas[i].y;

                if(i<casillas.length-1 && casillas[i].estaOcupada){ //revisar lo de i<hasta si en la de llegada ya hay ficha***********************


                    let num = 30;
                    if(casillas[i].tipo === 'H') {
                        mx += num;
                        casillas[i].fichas[0].move(casillas[i].x - num, casillas[i].y, velocidad);
                    }
                    else if(casillas[i].tipo === 'V') {
                        my += num;
                        casillas[i].fichas[0].move(casillas[i].x, casillas[i].y - num, velocidad);
                    }

                }

                createjs.Tween.get(self.token)
                    .to({x: mx, y: my, scaleX: 1.0, scaleY: 1.0}, velocidad)
                    .call(mover,[casillas,i+1,velocidad]);
            }
            else self.enMovimiento = false;
        }

        mover(casillasMov,0,velocidad);

        //mirar que no estuviera ocupada ya.... comer o barrera*********************************************************

        //dejamos la actual como libre otra vez
        this.casilla.estaOcupada=false;
        this.casilla.fichas[0]=null;
        //ocupamos la nueva
        this.casilla = casillas[hasta];
        this.casilla.estaOcupada = true;
        this.casilla.fichas[0] = this;
        //tal vez actualizar la ocupación solo cuando haya terminado la animación, y no antes????***
        //pequeño problema si se mueven dos a la vez y pasa una ficha por una casilla aun no ocupada
        //visualmente por la otra, pero si en el código.--revisar(no meterlo directamente en el else de la funcion mover)

    }

    mostrarMovimientos(){

        let movs = this.posiblesMovs[this.numero];
        movs.forEach(n =>{
            this.casillasCampo[n].iluminar(this);
        });

    }

    ocultarMovimientos(scale){
        if(this.seleccionada){
            this.seleccionada = false;
            createjs.Tween.get(this.token)
                .to({alpha: 0.4},200)
                .to({image: this.imgNormal},50)
                .to({alpha: 1.0},200);
            if(scale) createjs.Tween.get(this.token)
                .to({scaleX: this.escalaReal, scaleY: this.escalaReal},200);

            let movs = this.posiblesMovs[this.numero];
            movs.forEach(n =>{
                this.casillasCampo[n].noIluminar();
            });
        }
    }
    realizarMovimientoElegido(casilla){

        this.ocultarMovimientos(false);

        this.moveAnimate(this.casillasCampo,casilla.numero,200);

    }

    /*movimiento animado recursivo ....

    createjs.Tween.get(juego.fichas["roja"][0])
          .to({x: 367,y: 196, scaleX: 1.0, scaleY: 1.0}, 1000, createjs.Ease.getPowInOut(4)).call(mover,[xy,0]);

      function mover(pos,i){
          if(i<pos.length){
              createjs.Tween.get(juego.fichas["roja"][0])
                  .to({x: pos[i][0],y: pos[i][1]}, 300)
                  .call(mover,[pos,i+1]);
          }
      }
     */

}