class Game{
    constructor(canvas,queue,colorFichasUsuario,posicionesIniciales) {
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

        this.posicionesIniciales = posicionesIniciales;
        this.queue =queue;

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

        /* websocket...
        let url = "ws://localhost:63342/logica";
        let client = Stomp.client(url);

        let connect_callback = function() {
            // called back after the client is connected and authenticated to the STOMP server
        };

        let error_callback = function(error) {
            // display the error's message header:
            alert(error.headers.message);
        };

        client.connect("login", "pass", connect_callback, error_callback);
        */

    }


    fichasInit(color, xIni, yIni, sep, esc){

        this.casillasCasa[color][0]= new Casilla(this.stage,this.queue,xIni,yIni,'',0);
        this.casillasCasa[color][1]= new Casilla(this.stage,this.queue,xIni+sep,yIni,'',0);
        this.casillasCasa[color][2]= new Casilla(this.stage,this.queue,xIni,yIni+sep,'',0);
        this.casillasCasa[color][3]= new Casilla(this.stage,this.queue,xIni+sep,yIni+sep,'',0);

        let listeners = (this.userColor === color);

        this.fichas[color][0] = new Ficha(this.stage,this.queue,color,this.casillasCasa[color][0],listeners,esc,0,this.casillasCampo,this.casillasCasa,this.fichas);
        this.fichas[color][1] = new Ficha(this.stage,this.queue,color,this.casillasCasa[color][1],listeners,esc,1,this.casillasCampo,this.casillasCasa,this.fichas);
        this.fichas[color][2] = new Ficha(this.stage,this.queue,color,this.casillasCasa[color][2],listeners,esc,2,this.casillasCampo,this.casillasCasa,this.fichas);
        this.fichas[color][3] = new Ficha(this.stage,this.queue,color,this.casillasCasa[color][3],listeners,esc,3,this.casillasCampo,this.casillasCasa,this.fichas);

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

        //+++++casillasespeciales de llegada a meta, también indexadas con casillasCampo


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
        if(this.posicionesIniciales !== null && this.posicionesIniciales !== []){
            //pos 0 -> en casa ; != 0 indice de casilla
            //[roja0,roja1,roja2,roja3,azul0..azul3,verde0...,amarilla0]
            if(this.posicionesIniciales[0] !==0) this.fichas["roja"][0].moveC(this.casillasCampo[this.posicionesIniciales[0]]);
            if(this.posicionesIniciales[1] !==0) this.fichas["roja"][1].moveC(this.casillasCampo[this.posicionesIniciales[1]]);
            if(this.posicionesIniciales[2] !==0) this.fichas["roja"][2].moveC(this.casillasCampo[this.posicionesIniciales[2]]);
            if(this.posicionesIniciales[3] !==0) this.fichas["roja"][3].moveC(this.casillasCampo[this.posicionesIniciales[3]]);
            if(this.posicionesIniciales[4] !==0) this.fichas["azul"][0].moveC(this.casillasCampo[this.posicionesIniciales[4]]);
            if(this.posicionesIniciales[5] !==0) this.fichas["azul"][1].moveC(this.casillasCampo[this.posicionesIniciales[5]]);
            if(this.posicionesIniciales[6] !==0) this.fichas["azul"][2].moveC(this.casillasCampo[this.posicionesIniciales[6]]);
            if(this.posicionesIniciales[7] !==0) this.fichas["azul"][3].moveC(this.casillasCampo[this.posicionesIniciales[7]]);
            if(this.posicionesIniciales[8] !==0) this.fichas["verde"][0].moveC(this.casillasCampo[this.posicionesIniciales[8]]);
            if(this.posicionesIniciales[9] !==0) this.fichas["verde"][1].moveC(this.casillasCampo[this.posicionesIniciales[9]]);
            if(this.posicionesIniciales[10] !==0) this.fichas["verde"][2].moveC(this.casillasCampo[this.posicionesIniciales[10]]);
            if(this.posicionesIniciales[11] !==0) this.fichas["verde"][3].moveC(this.casillasCampo[this.posicionesIniciales[11]]);
            if(this.posicionesIniciales[12] !==0) this.fichas["amarilla"][0].moveC(this.casillasCampo[this.posicionesIniciales[12]]);
            if(this.posicionesIniciales[13] !==0) this.fichas["amarilla"][1].moveC(this.casillasCampo[this.posicionesIniciales[13]]);
            if(this.posicionesIniciales[14] !==0) this.fichas["amarilla"][2].moveC(this.casillasCampo[this.posicionesIniciales[14]]);
            if(this.posicionesIniciales[15] !==0) this.fichas["amarilla"][3].moveC(this.casillasCampo[this.posicionesIniciales[15]]);
        }

    }





/*
  function tick(event)
  {
   this.stage.update();
  }*/
}