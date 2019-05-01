/*************************************************************************************/



/* Versión día 13_04_2019
 * Archivo unificado de clases Game, Casilla y Ficha
 * para integración con Vue
*/



/**************************************************************************************/

export default class Game{
    constructor(canvas,queue,colorFichasUsuario,posicionesIniciales,socket,load_callback) {
        //setup createjs
        this.stage = new createjs.Stage(canvas);
        this.stage.enableMouseOver(); //permitir eventos onmouseover(con cursor:pointer) y onmouseout
        createjs.Ticker.framerate = 60; //60 ticks cada segundo
        createjs.Ticker.useRAF = true; //para usar requestAnimationFrame si lo permite el navegador(mejor performance)
        createjs.Ticker.addEventListener("tick", this.stage); //se hace stage.update() 60 veces por segundo
        //las veces que salta el evento tick debido a los fps marcados

        this.userColor=colorFichasUsuario;
        this.fichas = ["roja", "amarilla", "verde", "azul"];
        this.casillasCampo=[];
        this.casillasCasa=["roja", "amarilla","verde","azul"];

        this.posIni = posicionesIniciales;
        this.queue = queue;
        this.socket = socket;

        console.log("Partida iniciada")

        this.dibujarTableroInicial();

        /*
        //prueba texto....
        let text = new createjs.Text("Es el turno rojo", "bold 18px Arial", "red");
        text.x = 500;
        text.y = 500;
        text.alpha =0.0;
        text.scaleY = text.scaleX = 5.0;
        //text.alpha = 0.0;
        this.stage.addChild(text);

        createjs.Tween.get(text)
            .to({x: 100, y: 460, scaleX: 6.0, scaleY: 6.0,alpha: 0.8}, 1000)
            .wait(1000)
            .to({x:1000,alpha: 0.0}, 1000);

        */
       
       //carga completa del tablero
       setTimeout(load_callback, 1000);


    }


    fichasInit(color, xIni, yIni, sep, esc){

        this.casillasCasa[color][0]= new Casilla(this.stage,this.queue,xIni,yIni,'',0);
        this.casillasCasa[color][1]= new Casilla(this.stage,this.queue,xIni+sep,yIni,'',0);
        this.casillasCasa[color][2]= new Casilla(this.stage,this.queue,xIni,yIni+sep,'',0);
        this.casillasCasa[color][3]= new Casilla(this.stage,this.queue,xIni+sep,yIni+sep,'',0);

        let listeners = (this.userColor === color);

        this.fichas[color][0] = new Ficha(this.stage,this.queue,color,this.casillasCasa[color][0],listeners,esc,0,this.casillasCampo,this.casillasCasa,this.fichas,this.socket);
        this.fichas[color][1] = new Ficha(this.stage,this.queue,color,this.casillasCasa[color][1],listeners,esc,1,this.casillasCampo,this.casillasCasa,this.fichas,this.socket);
        this.fichas[color][2] = new Ficha(this.stage,this.queue,color,this.casillasCasa[color][2],listeners,esc,2,this.casillasCampo,this.casillasCasa,this.fichas,this.socket);
        this.fichas[color][3] = new Ficha(this.stage,this.queue,color,this.casillasCasa[color][3],listeners,esc,3,this.casillasCampo,this.casillasCasa,this.fichas,this.socket);

    }


    //crear con parametro de las 12 casillas y puesto inicial de cada una por si recarga de página y partida ya empezada....*************+
    //????
    dibujarTableroInicial(){


        this.casillasCampo[1]= new Casilla(this.stage,this.queue,580,942,'H',1);
        this.casillasCampo[2]= new Casilla(this.stage,this.queue,580,895,'H',2);
        this.casillasCampo[3]= new Casilla(this.stage,this.queue,580,848,'H',3);
        this.casillasCampo[4]= new Casilla(this.stage,this.queue,580,801,'H',4);
        this.casillasCampo[5]= new Casilla(this.stage,this.queue,580,753,'H',5);
        this.casillasCampo[6]= new Casilla(this.stage,this.queue,580,705,'H',6);
        this.casillasCampo[7]= new Casilla(this.stage,this.queue,580,658,'H',7);
        this.casillasCampo[8]= new Casilla(this.stage,this.queue,580,611,'H',8);
        this.casillasCampo[9]= new Casilla(this.stage,this.queue,607,580,'V',9);
        this.casillasCampo[10]= new Casilla(this.stage,this.queue,654,580,'V',10);
        this.casillasCampo[11]= new Casilla(this.stage,this.queue,701,580,'V',11);
        this.casillasCampo[12]= new Casilla(this.stage,this.queue,748,580,'V',12);
        this.casillasCampo[13]= new Casilla(this.stage,this.queue,795,580,'V',13);
        this.casillasCampo[14]= new Casilla(this.stage,this.queue,842,580,'V',14);
        this.casillasCampo[15]= new Casilla(this.stage,this.queue,889,580,'V',15);
        this.casillasCampo[16]= new Casilla(this.stage,this.queue,940,580,'V',16);

        this.casillasCampo[17]= new Casilla(this.stage,this.queue,940,477,'V',17);

        this.casillasCampo[18]= new Casilla(this.stage,this.queue,940,370,'V',18);
        this.casillasCampo[19]= new Casilla(this.stage,this.queue,889,370,'V',19);
        this.casillasCampo[20]= new Casilla(this.stage,this.queue,842,370,'V',20);
        this.casillasCampo[21]= new Casilla(this.stage,this.queue,795,370,'V',21);
        this.casillasCampo[22]= new Casilla(this.stage,this.queue,748,370,'V',22);
        this.casillasCampo[23]= new Casilla(this.stage,this.queue,701,370,'V',23);
        this.casillasCampo[24]= new Casilla(this.stage,this.queue,654,370,'V',24);
        this.casillasCampo[25]= new Casilla(this.stage,this.queue,607,370,'V',25);
        this.casillasCampo[26]= new Casilla(this.stage,this.queue,580,337,'H',26);
        this.casillasCampo[27]= new Casilla(this.stage,this.queue,580,290,'H',27);
        this.casillasCampo[28]= new Casilla(this.stage,this.queue,580,243,'H',28);
        this.casillasCampo[29]= new Casilla(this.stage,this.queue,580,196,'H',29);
        this.casillasCampo[30]= new Casilla(this.stage,this.queue,580,149,'H',30);
        this.casillasCampo[31]= new Casilla(this.stage,this.queue,580,102,'H',31);
        this.casillasCampo[32]= new Casilla(this.stage,this.queue,580,55,'H',32);
        this.casillasCampo[33]= new Casilla(this.stage,this.queue,580,8,'H',33);

        this.casillasCampo[34]= new Casilla(this.stage,this.queue,475,8,'H',34);

        this.casillasCampo[35]= new Casilla(this.stage,this.queue,367,8,'H',35);
        this.casillasCampo[36]= new Casilla(this.stage,this.queue,367,55,'H',36);
        this.casillasCampo[37]= new Casilla(this.stage,this.queue,367,102,'H',37);
        this.casillasCampo[38]= new Casilla(this.stage,this.queue,367,149,'H',38);
        this.casillasCampo[39]= new Casilla(this.stage,this.queue,367,196,'H',39);
        this.casillasCampo[40]= new Casilla(this.stage,this.queue,367,243,'H',40);
        this.casillasCampo[41]= new Casilla(this.stage,this.queue,367,290,'H',41);
        this.casillasCampo[42]= new Casilla(this.stage,this.queue,367,337,'H',42);
        this.casillasCampo[43]= new Casilla(this.stage,this.queue,337,370,'V',43);
        this.casillasCampo[44]= new Casilla(this.stage,this.queue,290,370,'V',44);
        this.casillasCampo[45]= new Casilla(this.stage,this.queue,243,370,'V',45);
        this.casillasCampo[46]= new Casilla(this.stage,this.queue,196,370,'V',46);
        this.casillasCampo[47]= new Casilla(this.stage,this.queue,149,370,'V',47);
        this.casillasCampo[48]= new Casilla(this.stage,this.queue,102,370,'V',48);
        this.casillasCampo[49]= new Casilla(this.stage,this.queue,55,370,'V',49);
        this.casillasCampo[50]= new Casilla(this.stage,this.queue,8,370,'V',50);

        this.casillasCampo[51]= new Casilla(this.stage,this.queue,8,473,'V',51);

        this.casillasCampo[52]= new Casilla(this.stage,this.queue,8,580,'V',52);
        this.casillasCampo[53]= new Casilla(this.stage,this.queue,55,580,'V',53);
        this.casillasCampo[54]= new Casilla(this.stage,this.queue,102,580,'V',54);
        this.casillasCampo[55]= new Casilla(this.stage,this.queue,149,580,'V',55);
        this.casillasCampo[56]= new Casilla(this.stage,this.queue,196,580,'V',56);
        this.casillasCampo[57]= new Casilla(this.stage,this.queue,243,580,'V',57);
        this.casillasCampo[58]= new Casilla(this.stage,this.queue,290,580,'V',58);
        this.casillasCampo[59]= new Casilla(this.stage,this.queue,337,580,'V',59);
        this.casillasCampo[60]= new Casilla(this.stage,this.queue,367,611,'H',60);
        this.casillasCampo[61]= new Casilla(this.stage,this.queue,367,658,'H',61);
        this.casillasCampo[62]= new Casilla(this.stage,this.queue,367,705,'H',62);
        this.casillasCampo[63]= new Casilla(this.stage,this.queue,367,753,'H',63);
        this.casillasCampo[64]= new Casilla(this.stage,this.queue,367,801,'H',64);
        this.casillasCampo[65]= new Casilla(this.stage,this.queue,367,848,'H',65);
        this.casillasCampo[66]= new Casilla(this.stage,this.queue,367,895,'H',66);
        this.casillasCampo[67]= new Casilla(this.stage,this.queue,367,942,'H',67);

        this.casillasCampo[68]= new Casilla(this.stage,this.queue,475,942,'H',68);

        //+++++faltan casillasespeciales de llegada a meta*******************************************************+


        this.casillasCasa["roja"] = []; this.casillasCasa["amarilla"] = [];
        this.casillasCasa["verde"] = []; this.casillasCasa["azul"] = [];
        this.fichas["roja"] = []; this.fichas["amarilla"] = [];
        this.fichas["verde"] = []; this.fichas["azul"] = [];

        let sep = 125;
        let escala = 2.0;
        this.fichasInit("roja",60,60,sep,escala);
        this.fichasInit("verde",60,725,sep,escala);
        this.fichasInit("azul",725,60,sep,escala);
        this.fichasInit("amarilla",725,725,sep,escala);

        //cambiamos la predisposición por defecto de todas en casa por la nueva
        if(this.posIni !== null && this.posIni !== []){
            
            for(let i in this.posIni){
                if(this.posIni[i].vector==="casillasCasa"){
                    //por defecto ya estan en las casillas casa al crear los objetos ficha
                }
                else if(this.posIni[i].vector==="casillasCampo"){
                    this.fichas[this.posIni[i].color][this.posIni[i].n].moveC(this.casillasCampo[this.posIni[i].num]);
                }
                
            }


        }
    }





/*
  function tick(event)
  {
   this.stage.update();
  }*/
}



/*************************************************************************************/



/**************** CLASE CASILLA */
/** apuntes: -queue adaptada del codigo original, cogida directamente mediante carga en el DOM*/


/**************************************************************************************/

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

            let nuevoBitMap = new createjs.Bitmap(this.imagenes[this.fichaIlum.color]);
            //let nuevoBitMap = new createjs.Bitmap(document.getElementById(this.fichaIlum.color));
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

/*************************************************************************************/



/**************** CLASE FICHA */
/** apuntes: -queue adaptada del codigo original, cogida directamente mediante carga en el DOM*/



/**************************************************************************************/


class Ficha{
    constructor(stage,queue,color,casilla,listeners,esc,numero,casillasCampo,casillasCasa,fichasTot,socket){
        this.casilla = casilla;
        this.casilla.estaOcupada=true;
        this.casilla.fichas[0]=this;
        this.color = color;
        this.imagenes = queue;
        this.numero = numero;
        this.socket = socket;

        //mirar de hacer acceso a casillas y fichas desde game y no desde clase fichaa???***********
        this.casillasCampo = casillasCampo;
        this.casillasCasa = casillasCasa;
        this.fichasTot = fichasTot;
        //***************************************************************************************

        this.token = new createjs.Bitmap(this.imagenes[this.color]);
        //this.token = new createjs.Bitmap(document.getElementById(this.color));
        this.token.x = this.casilla.x;
        this.token.y = this.casilla.y;
        this.token.scaleX = this.token.scaleY = esc;

        this.escalaReal = esc;
        this.enMovimiento = false;
        this.seleccionada = false;


        //solo para probar, los movs hay que solicitarlos al servidor**********************
        //BORRAR
        /*this.posiblesMovs = [
            [5,9,11,12], //para ficha 0
            [3,2,67,10], //para ficha 1
            [6,35,51,64], //para ficha 2
            [12,35,41,28] //para ficha 3
        ]; */

        this.posiblesMovs = null

        //**********************************************************************************


        stage.addChild(this.token);

        if(listeners){

            this.imgClick = new createjs.Bitmap(this.imagenes[this.color+"Click"]).image;
            this.imgNormal = new createjs.Bitmap(this.imagenes[this.color]).image;

            //this.imgClick = new createjs.Bitmap(document.getElementById(this.color+"Click")).image;
            //this.imgNormal = new createjs.Bitmap(document.getElementById(this.color)).image;

            this.token.addEventListener("click", () => {
                if(!this.enMovimiento && !this.seleccionada){

                    this.seleccionada = true;
                    createjs.Tween.get(this.token)
                        .to({alpha: 0.4},200)
                        .to({image: this.imgClick},50)
                        .to({alpha: 1.0},200);


                    

                    //y ocultar los movs del resto si hubiera alguna activo, a modo de switch en la selección
                    this.fichasTot[this.color].forEach((f,i) =>{
                        if(i!==this.numero) f.ocultarMovimientos(true);
                    })

                    this.mostrarMovimientos(); 


                } else if (!this.enMovimiento && this.seleccionada){
                    //si se vuelve a hacer click sobre la misma, se quita la seleccion
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

    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //Mueve estaticamente, sin animación, la ficha directamente a la casilla seleccionada
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    moveC(casilla){
        //Comprobar correcto funcionamiento**************************************************+

        //si la de la que me muevo esta en barrera->poner en el medio la ficha que queda
        if(this.casilla.estaBarrera){

            this.casilla.estaBarrera = false;
            this.casilla.estaOcupada = true;
            //la que se va es la primera del vector
            if(this.casilla.fichas[0] === this){
                this.casilla.fichas[0] = this.casilla.fichas[1];
            }
            this.casilla.fichas[1] = null;

            this.casilla.fichas[0].token.x = this.casilla.x;
            this.casilla.fichas[0].token.y = this.casilla.y;

        } else{
            //dejamos la actual como libre otra vez
            this.casilla.estaOcupada=false;
            this.casilla.fichas[0]=null;
        }

        this.token.x = casilla.x;
        this.token.y = casilla.y;
        this.token.scaleX = this.token.scaleY = 1.0;
        this.escalaReal=1.0;


        //ocupamos la nueva
        this.casilla = casilla;

        //si la nueva ya estaba ocupada, se forma barrera
        //no puede estar la nueva en barrera porque la lógica del juego no habría
        //enviado ese movimiento
        if(this.casilla.estaOcupada){
            this.casilla.estaOcupada = false;
            this.casilla.estaBarrera = true;

            this.casilla.fichas[1] = this;
            //reajustamos las posiciones
            let num = 20;
            if(this.casilla.tipo === 'H') {         //intersecciones modificadas para que entren las barreras
                if(this.casilla.numero===26 || this.casilla.numero===8){
                    this.casilla.fichas[0].token.x = this.casilla.x - 30;
                    this.casilla.fichas[1].token.x = this.casilla.x + 5;
                }
                else if(this.casilla.numero===42 || this.casilla.numero===60){
                    this.casilla.fichas[0].token.x = this.casilla.x - 5;
                    this.casilla.fichas[1].token.x = this.casilla.x +30;
                }
                else{
                    this.casilla.fichas[0].token.x = this.casilla.x - num;
                    this.casilla.fichas[1].token.x = this.casilla.x + num;
                }
            }
            else if(this.casilla.tipo === 'V') {    //intersecciones modificadas para que entren las barreras
                if(this.casilla.numero===25 || this.casilla.numero===43 ){
                    this.casilla.fichas[0].token.y = this.casilla.y - 5;
                    this.casilla.fichas[1].token.y = this.casilla.y + 30;
                }
                else if(this.casilla.numero===59 || this.casilla.numero===9){
                    this.casilla.fichas[0].token.y = this.casilla.y - 30;
                    this.casilla.fichas[1].token.y = this.casilla.y + 5;
                }
                else{
                    this.casilla.fichas[0].token.y = this.casilla.y - num;
                    this.casilla.fichas[1].token.y = this.casilla.y + num;
                }

            }

        }else{
            this.casilla.estaOcupada = true;
            this.casilla.fichas[0] = this;
        }
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

        if(this.casilla.estaBarrera){

            this.casilla.estaBarrera = false;
            this.casilla.estaOcupada = true;
            //la que se va es la primera del vector
            if(this.casilla.fichas[0] === this){
                this.casilla.fichas[0] = this.casilla.fichas[1];
            }
            this.casilla.fichas[1] = null;
            this.casilla.fichas[0].move(this.casilla.x,this.casilla.y,velocidad);

        } else{
            //dejamos la actual como libre otra vez
            this.casilla.estaOcupada=false;
            this.casilla.fichas[0]=null;
        }


        let self = this;
        function mover(casillas,i,velocidad){

            if(i<casillas.length){

                //Si casilla anterior ocupada(i-1) mover al medio de la casilla su ficha.
                //Si casilla anterior barrera(i-1) mover a posicion de barrera de la casilla las dos fichas
                //Si la casilla a la que se va a mover ahora esta ocupada,desviar a la izquierda
                //la ficha que lo ocupa y pasar desviando por la derecha
                //Si la casilla a la que se va a mover ahora esta barrera,abrir paso en la barrera
                //y pasar por el medio.

                if(i>0 && casillas[i-1].estaOcupada){
                    casillas[i-1].fichas[0].move(casillas[i-1].x,casillas[i-1].y,velocidad);
                }
                ////////////////////FANTASIA////////////////////
                if(i>0 && casillas[i-1].estaBarrera && casillas[i-1].tipo==='H'){
                    if(casillas[i-1].numero===26 || casillas[i-1].numero===8 ){
                        casillas[i-1].fichas[0].move(casillas[i-1].x-30,casillas[i-1].y,velocidad);
                        casillas[i-1].fichas[1].move(casillas[i-1].x+5,casillas[i-1].y,velocidad);
                    }
                    else if(casillas[i-1].numero===42 || casillas[i-1].numero===60){
                        casillas[i-1].fichas[0].move(casillas[i-1].x-5,casillas[i-1].y,velocidad);
                        casillas[i-1].fichas[1].move(casillas[i-1].x+30,casillas[i-1].y,velocidad);
                    }
                    else{
                        casillas[i-1].fichas[0].move(casillas[i-1].x-20,casillas[i-1].y,velocidad);
                        casillas[i-1].fichas[1].move(casillas[i-1].x+20,casillas[i-1].y,velocidad);
                    }

                }
                else if(i>0 && casillas[i-1].estaBarrera && casillas[i-1].tipo==='V'){
                    if(casillas[i-1].numero===25 || casillas[i-1].numero===43 ){
                        casillas[i-1].fichas[0].move(casillas[i-1].x,casillas[i-1].y-5,velocidad);
                        casillas[i-1].fichas[1].move(casillas[i-1].x,casillas[i-1].y+30,velocidad);
                    }
                    else if(casillas[i-1].numero===59 || casillas[i-1].numero===9){
                        casillas[i-1].fichas[0].move(casillas[i-1].x,casillas[i-1].y-30,velocidad);
                        casillas[i-1].fichas[1].move(casillas[i-1].x,casillas[i-1].y+5,velocidad);
                    }
                    else{
                        casillas[i-1].fichas[0].move(casillas[i-1].x,casillas[i-1].y-20,velocidad);
                        casillas[i-1].fichas[1].move(casillas[i-1].x,casillas[i-1].y+20,velocidad);
                    }

                }
                ///////////////////FANTASIA-FIN////////////////////


                let mx = casillas[i].x,
                    my = casillas[i].y;
                ////////////////////FANTASIA////////////////////
                if(casillas[i].estaBarrera){
                    let num = 50;
                    if(i===casillas.length-1) num=20;

                    if(casillas[i].tipo === 'H') {

                        casillas[i].fichas[0].move(casillas[i].x - num, casillas[i].y, velocidad);
                        casillas[i].fichas[1].move(casillas[i].x + num, casillas[i].y, velocidad);

                    }
                    else if(casillas[i].tipo === 'V') {
                        casillas[i].fichas[0].move(casillas[i].x, casillas[i].y - num, velocidad);
                        casillas[i].fichas[1].move(casillas[i].x, casillas[i].y + num, velocidad);
                    }

                }
                //////////////////FANTASIA-FIN//////////////////////
                else if(casillas[i].estaOcupada){

                    let num = 30;
                    if(i===casillas.length-1) num=20;

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
            else { //fin de la animacion
                self.enMovimiento = false;

                //ocupamos la nueva una vez terminada la operación,
                //para no crear anomalías con otras animaciones que pasen por allí
                //y piensen que hay una ficha cuando aún no la hay
                self.casilla = casillas[casillas.length-1]; //casillas[hasta]

                if(self.casilla.estaOcupada) { //comer o barrera*********************************************************
                    self.casilla.estaOcupada = false;
                    self.casilla.estaBarrera = true;
                    self.casilla.fichas[1] = self;
                }else{
                    self.casilla.estaOcupada = true;
                    self.casilla.fichas[0] = self;
                }
            }
        }

        mover(casillasMov,0,velocidad);


    }

    mostrarMovimientos(){
        if(this.posiblesMovs !== null){
            let movs = this.posiblesMovs[this.numero];
            movs.forEach(n =>{
                this.casillasCampo[n].iluminar(this);
            });
        }
        

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

            if(this.posiblesMovs !== null){
                let movs = this.posiblesMovs[this.numero];
                movs.forEach(n =>{
                    this.casillasCampo[n].noIluminar();
                });
            }
            
        }
    }

    realizarMovimientoElegido(casilla){

        this.ocultarMovimientos(false);

        this.moveAnimate(this.casillasCampo,casilla.numero,200);

        //comprobar vector:, puesto ahora en estatico como siempre campo (pruebas)**************
        let payload = {
            color: this.color,
            n: this.numero,
            vector: "casillasCampo",
            num: casilla.numero
        };

        this.socket.emit('mover', payload);

    }

}