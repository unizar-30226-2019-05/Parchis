
/* eslint-disable */
/*************************************************************************************/



/* Versión día 10_05_2019
 * Archivo unificado de clases Game, Casilla y Ficha
 * para integración con Vue
*/



/**************************************************************************************/

export default class Game{

    constructor(canvas,queue,jugadores,colorFichasUsuario,posicionesIniciales,socket,load_callback,porParejas,ndados,lista) {
        //setup createjs
        this.stage = new createjs.Stage(canvas);
        this.stage.enableMouseOver(); //permitir eventos onmouseover(con cursor:pointer) y onmouseout
        createjs.Ticker.framerate = 60; //60 ticks cada segundo
        createjs.Ticker.useRAF = true; //para usar requestAnimationFrame si lo permite el navegador(mejor performance)
        createjs.Ticker.addEventListener("tick", this.stage); //se hace stage.update() 60 veces por segundo
        //las veces que salta el evento tick debido a los fps marcados

        this.userColor=colorFichasUsuario;
        this.fichas = [];
        this.casillasCampo=[];
        this.casillasCasa=jugadores;
        this.casillasMeta=[];
        this.casillasFin=jugadores;
        this.tipoTablero=jugadores.length; //numero de jugadores(4 u 8)
        let value = "hola"
        for(let i=0;i<lista.length;i++){
            if(this.userColor === lista[i].color){
                console.log("COOOOLL "+lista[i].user.dados.dados)
                value = lista[i].user.dados.dados
            }
        }
        if(value === "blanco") value = ""
        this.colores = jugadores
        this.porParejas = porParejas
        this.parejas = this.initVectorParejas()
        
        this.posIni = posicionesIniciales;
        this.queue = queue;
        this.socket = socket;
        this.numDados = ndados
        console.log("Partida iniciada")

        if(this.tipoTablero===4){
            this.dibujarTableroInicial();
        }
        else{
            this.dibujarTableroInicial8();
        }
        
        //PARA CAMBIAR DE COLOR DE DADOS SIMPLEMENTE METER EN EL VECTOR this.dados LAS IMAGENES DE COLOR DE [1] a [6] ***********************
        //cargar los 6 bitmaps en el vector dados

        this.dados = []
        for(let i=1;i<=6;i++) {
            let magia = "dado"+i+value
            this.dados[i] = new createjs.Bitmap(document.getElementById(magia)).image;
        }
        //tablero dados...
        this.click = false
        this.fondoDados = new createjs.Shape();
        //crear las dos entidades posibles de dados
        this.dado1 = new createjs.Bitmap(); 
        this.dado2 = new createjs.Bitmap();
        this.dado1.image = this.dados[Math.floor(Math.random() * 6) + 1 ]
        this.dado2.image = this.dados[Math.floor(Math.random() * 6) + 1 ]
        this.dado1.alpha = 1;  this.dado2.alpha = 1; 

        //Configuración según tablero y dados...
        if(this.tipoTablero === 4){
            this.fondoDados.graphics.beginFill("white").drawCircle(0, 0, 60);
            this.fondoDados.x = 500;
            this.fondoDados.y = 500;

            this.dado1.scale = 0.11; this.dado2.scale = 0.11;
            this.dado1.x = 465; this.dado1.y = 455
            this.dado2.x = 490; this.dado2.y = 500
            if(this.numDados === 1){
                this.dado1.scale = 0.19
                this.dado1.x = 458; this.dado1.y = 465
                this.dado2.alpha = 0; 
            }

        }else if(this.tipoTablero === 8){
            this.fondoDados.graphics.beginFill("white").drawCircle(0, 0, 120);
            this.fondoDados.x = 705;
            this.fondoDados.y = 705;

            this.dado1.scale = 0.19; this.dado2.scale = 0.19;
            this.dado1.x = 630; this.dado1.y = 630
            this.dado2.x = 700; this.dado2.y = 700
            if(this.numDados === 1){
                this.dado1.scale = 0.25
                this.dado1.x = 650; this.dado1.y = 655
                this.dado2.alpha = 0; 
            }
             
        }
        
        this.fondoDados.addEventListener("click", ()=>{
            if(this.click){
                
                this.socket.emit('tirarDados', this.userColor);
                this.fondoDados.cursor = "default";
                this.click = false
            }
        });



        this.stage.addChild(this.fondoDados);
        this.stage.addChild(this.dado1);
        this.stage.addChild(this.dado2);

        //this.stage.removeChild(this.fondoDados);

        //carga completa del tablero
        setTimeout(load_callback, 1000);


    }

    mostrarTiradaInicial(xmin,xmax,ymin,ymax,dados1,dados2,colGanador){

        let div = this.numDados === 1 ? 3 : 4
        let lineTo = Math.floor((ymax-ymin)/div)
        let columnTo = Math.floor((xmax-xmin)/(this.tipoTablero))
        let dScale = this.tipoTablero === 4 ? 0.15 : 0.25
        let fScale = this.tipoTablero === 4 ? 1.5 : 2.0

        let rect = new createjs.Shape()
        rect.graphics.beginStroke("black").beginFill("white").drawRect(xmin, ymin, xmax-xmin, ymax-ymin)
        let text1 = new createjs.Text("Tirada inicial", "40px Arial", "black")
        text1.x = xmin+50
        text1.y = ymin+30

        this.stage.addChild(rect)
        this.stage.addChild(text1)

        let f = []
        this.colores.forEach( (c,i)=> {
            f[i] = new createjs.Bitmap(this.queue[c])
            f[i].x = xmin + (columnTo*(i)) +columnTo/4
            f[i].y = ymin+lineTo
            f[i].scale = fScale
            this.stage.addChild(f[i])
        })

        let d = []
        dados1.forEach( (dado,i)=> {
            d[i] = new createjs.Bitmap()
            d[i].x = xmin + (columnTo*(i)) +columnTo/4
            d[i].y = ymin+lineTo*2
            d[i].scale = dScale
            d[i].alpha = 0
            this.stage.addChild(d[i])
            this.tirar(d[i],dado)
        })

        let d2 = []
        if(dados2){

            dados2.forEach( (dado,i)=> {
                d2[i] = new createjs.Bitmap()
                d2[i].x = xmin + (columnTo*(i)) +columnTo/4
                d2[i].y = ymin+lineTo*3
                d2[i].scale = dScale
                d2[i].alpha = 0
                this.stage.addChild(d2[i])
                this.tirar(d2[i],dado)
            })

        }

        setTimeout( () => {
            
            this.stage.removeChild(text1)
            f.forEach(col => {this.stage.removeChild(col)})
            d.forEach(dado => {this.stage.removeChild(dado)})
            if(dados2) d2.forEach(dado => {this.stage.removeChild(dado)})

            let text2 = new createjs.Text("El primer turno para", "40px Arial", "black")
            text2.x = xmin+50
            text2.y = ymin+50
            let ficha = new createjs.Bitmap(this.queue[colGanador])
            ficha.x = xmin+500
            ficha.y = ymin+30
            ficha.scale = fScale
            this.stage.addChild(text2)
            this.stage.addChild(ficha)

            setTimeout( () => {
                this.stage.removeChild(text2)
                this.stage.removeChild(ficha)
                this.stage.removeChild(rect)

            },3000) //animacion muestra ganador turno inicial

            
        },5000) //5seg animacion dados



        

    }
    tiradaInicial(dados1,dados2,colGanador){

        if(this.tipoTablero === 4){

            let xmin = 100, xmax = 900
            let ymin = 50, ymax = 350

            this.mostrarTiradaInicial(xmin,xmax,ymin,ymax,dados1,dados2,colGanador)

            

        }else if(this.tipoTablero === 8){

            let xmin = 100, xmax = 1400
            let ymin = 50, ymax = 550

            this.mostrarTiradaInicial(xmin,xmax,ymin,ymax,dados1,dados2,colGanador)

        }
    }

    initVectorParejas(){
        
        let v=[]
        if(this.tipoTablero === 8){
            if(this.porParejas){
                v['amarilla'] = 'morada'; v['morada'] = 'amarilla'; v['cyan'] = 'azul'; v['azul'] = 'cyan'
                v['naranja'] = 'roja'; v['roja'] = 'naranja'; v['verde'] = 'verdeOs'; v['verdeOs'] = 'verdeOs'
            }else{
                v['amarilla'] = ''; v['morada'] = ''; v['cyan'] = ''; v['azul'] = ''
                v['naranja'] = ''; v['roja'] = ''; v['verde'] = ''; v['verdeOs'] = ''
            }
        }else{ //si es 4
            if(this.porParejas) { v['amarilla'] = 'roja'; v['roja'] = 'amarilla'; v['azul'] = 'verde'; v['verde'] = 'azul' }
            else { v['amarilla'] = ''; v['roja'] = ''; v['azul'] = ''; v['verde'] = '' }
        }
        return v;
    }
    //devuelve vector de 5
    componerVectorRandom(num){
        let v=[1,2,3,4,5,6]
        //quitamos el número que será el último en salir
        v.splice(num-1,1)
        //reordenamos de forma random para que no se muestre siempre la misma animación del 1 a num
        v.sort(() => Math.random() - 0.5)
        return v
    }
    tirar(dado,num){
        let tFade = 60
        let tWait = 25
        let alphaMin = 0.4
        let alphaMax = 0.8
        let v = this.componerVectorRandom(num)

        createjs.Tween.get(dado)
        .to({alpha: 0}, 0)
        .to({image: this.dados[v[0]]},0)
        .to({alpha: alphaMax}, tFade)
        .wait(tWait)
        .to({alpha: alphaMin}, tFade)
        .wait(tWait)

        .to({image: this.dados[v[1]]},0)
        .to({alpha: alphaMax}, tFade)
        .wait(tWait)
        .to({alpha: alphaMin}, tFade)
        .wait(tWait)

        .to({image: this.dados[v[2]]},0)
        .to({alpha: alphaMax}, tFade)
        .wait(tWait)
        .to({alpha: alphaMin}, tFade)
        .wait(tWait)

        .to({image: this.dados[v[3]]},0)
        .to({alpha: alphaMax}, tFade)
        .wait(tWait)
        .to({alpha: alphaMin}, tFade)
        .wait(tWait)

        .to({image: this.dados[v[4]]},0)
        .to({alpha: alphaMax}, tFade)
        .wait(tWait)
        .to({alpha: alphaMin}, tFade)
        .wait(tWait)

        .to({image: this.dados[num]},0)
        .to({alpha: 1}, tFade)
    }
    tirarDados(dado1,dado2,animacion){
        if(animacion){
            if(dado1) this.tirar(this.dado1,dado1)
            if(dado2) this.tirar(this.dado2,dado2)
        }else{ //solo para recover de salas
            if(dado1) {this.dado1.image = this.dados[dado1]; this.dado1.alpha = 1}
            if(dado2) {this.dado2.image = this.dados[dado2]; this.dado2.alpha = 1}
        }
        
    }

    switchListener(click){
        this.click = click
        if(this.click) this.fondoDados.cursor = "pointer";

    }

    fichasInit(color, xIni, yIni, sep, esc){

        this.casillasCasa[color][0]= new Casilla(this.stage,this.queue,xIni,yIni,'',0,false);
        this.casillasCasa[color][1]= new Casilla(this.stage,this.queue,xIni+sep,yIni,'',0,false);
        this.casillasCasa[color][2]= new Casilla(this.stage,this.queue,xIni,yIni+sep,'',0,false);
        this.casillasCasa[color][3]= new Casilla(this.stage,this.queue,xIni+sep,yIni+sep,'',0,false);

        let listeners = (this.userColor === color || this.parejas[this.userColor] === color);

        this.fichas[color][0] = new Ficha(this.stage,this.queue,color,this.casillasCasa[color][0],listeners,esc,0,this.casillasCampo,this.casillasCasa,this.casillasMeta,this.casillasFin,this.fichas,this.socket,this.tipoTablero,this.parejas[color]);
        this.fichas[color][1] = new Ficha(this.stage,this.queue,color,this.casillasCasa[color][1],listeners,esc,1,this.casillasCampo,this.casillasCasa,this.casillasMeta,this.casillasFin,this.fichas,this.socket,this.tipoTablero,this.parejas[color]);
        this.fichas[color][2] = new Ficha(this.stage,this.queue,color,this.casillasCasa[color][2],listeners,esc,2,this.casillasCampo,this.casillasCasa,this.casillasMeta,this.casillasFin,this.fichas,this.socket,this.tipoTablero,this.parejas[color]);
        this.fichas[color][3] = new Ficha(this.stage,this.queue,color,this.casillasCasa[color][3],listeners,esc,3,this.casillasCampo,this.casillasCasa,this.casillasMeta,this.casillasFin,this.fichas,this.socket,this.tipoTablero,this.parejas[color]);


    }
    fichasInit8(color, xIni, yIni, sep, esc,IniP){

        if(IniP==1){
            this.casillasCasa[color][0]= new Casilla(this.stage,this.queue,xIni+sep/2,yIni - sep,'',0,false);
            this.casillasCasa[color][1]= new Casilla(this.stage,this.queue,xIni+sep,yIni+sep/2,'',0,false);
            this.casillasCasa[color][2]= new Casilla(this.stage,this.queue,xIni-sep,yIni-sep/2,'',0,false);
            this.casillasCasa[color][3]= new Casilla(this.stage,this.queue,xIni-sep/2,yIni+sep,'',0,false);
        }
        else{
            this.casillasCasa[color][0]= new Casilla(this.stage,this.queue,xIni-sep/2,yIni - sep,'',0,false);
            this.casillasCasa[color][1]= new Casilla(this.stage,this.queue,xIni+sep,yIni-sep/2,'',0,false);
            this.casillasCasa[color][2]= new Casilla(this.stage,this.queue,xIni-sep,yIni+sep/2,'',0,false);
            this.casillasCasa[color][3]= new Casilla(this.stage,this.queue,xIni+sep/2,yIni+sep,'',0,false);
        }

        let listeners = (this.userColor === color || this.parejas[this.userColor] === color)

        this.fichas[color][0] = new Ficha(this.stage,this.queue,color,this.casillasCasa[color][0],listeners,esc,0,this.casillasCampo,this.casillasCasa,this.casillasMeta,this.casillasFin,this.fichas,this.socket,this.tipoTablero,this.parejas[color]);
        this.fichas[color][1] = new Ficha(this.stage,this.queue,color,this.casillasCasa[color][1],listeners,esc,1,this.casillasCampo,this.casillasCasa,this.casillasMeta,this.casillasFin,this.fichas,this.socket,this.tipoTablero,this.parejas[color]);
        this.fichas[color][2] = new Ficha(this.stage,this.queue,color,this.casillasCasa[color][2],listeners,esc,2,this.casillasCampo,this.casillasCasa,this.casillasMeta,this.casillasFin,this.fichas,this.socket,this.tipoTablero,this.parejas[color]);
        this.fichas[color][3] = new Ficha(this.stage,this.queue,color,this.casillasCasa[color][3],listeners,esc,3,this.casillasCampo,this.casillasCasa,this.casillasMeta,this.casillasFin,this.fichas,this.socket,this.tipoTablero,this.parejas[color]);

    }
    //casillas que avanzan hasta la meta
    fichasMeta(bool){
        this.casillasMeta["azul"][200] = new Casilla(this.stage,this.queue,889,477,'V',200,true);
        this.casillasMeta["azul"][201] = new Casilla(this.stage,this.queue,842,477,'V',201,true);
        this.casillasMeta["azul"][202] = new Casilla(this.stage,this.queue,795,477,'V',202,true);
        this.casillasMeta["azul"][203] = new Casilla(this.stage,this.queue,748,477,'V',203,true);
        this.casillasMeta["azul"][204] = new Casilla(this.stage,this.queue,701,477,'V',204,true);
        this.casillasMeta["azul"][205] = new Casilla(this.stage,this.queue,654,477,'V',205,true);
        this.casillasMeta["azul"][206] = new Casilla(this.stage,this.queue,607,477,'V',206,true);

        this.casillasMeta["roja"][300] = new Casilla(this.stage,this.queue,475,55,'H',300,true);
        this.casillasMeta["roja"][301] = new Casilla(this.stage,this.queue,475,102,'H',301,true);
        this.casillasMeta["roja"][302] = new Casilla(this.stage,this.queue,475,149,'H',302,true);
        this.casillasMeta["roja"][303] = new Casilla(this.stage,this.queue,475,196,'H',303,true);
        this.casillasMeta["roja"][304] = new Casilla(this.stage,this.queue,475,243,'H',304,true);
        this.casillasMeta["roja"][305] = new Casilla(this.stage,this.queue,475,290,'H',305,true);
        this.casillasMeta["roja"][306] = new Casilla(this.stage,this.queue,475,337,'H',306,true);

        this.casillasMeta["verde"][400] = new Casilla(this.stage,this.queue,55,473,'V',400,true);
        this.casillasMeta["verde"][401] = new Casilla(this.stage,this.queue,102,473,'V',401,true);
        this.casillasMeta["verde"][402] = new Casilla(this.stage,this.queue,149,473,'V',402,true);
        this.casillasMeta["verde"][403] = new Casilla(this.stage,this.queue,196,473,'V',403,true);
        this.casillasMeta["verde"][404] = new Casilla(this.stage,this.queue,243,473,'V',404,true);
        this.casillasMeta["verde"][405] = new Casilla(this.stage,this.queue,290,473,'V',405,true);
        this.casillasMeta["verde"][406] = new Casilla(this.stage,this.queue,337,473,'V',406,true);

        this.casillasMeta["amarilla"][500] = new Casilla(this.stage,this.queue,475,895,'H',500,true);
        this.casillasMeta["amarilla"][501] = new Casilla(this.stage,this.queue,475,848,'H',501,true);
        this.casillasMeta["amarilla"][502] = new Casilla(this.stage,this.queue,475,801,'H',502,true);
        this.casillasMeta["amarilla"][503] = new Casilla(this.stage,this.queue,475,753,'H',503,true);
        this.casillasMeta["amarilla"][504] = new Casilla(this.stage,this.queue,475,705,'H',504,true);
        this.casillasMeta["amarilla"][505] = new Casilla(this.stage,this.queue,475,658,'H',505,true);
        this.casillasMeta["amarilla"][506] = new Casilla(this.stage,this.queue,475,611,'H',506,true);

    }

    fichasMeta8(bool){
        this.casillasMeta["amarilla"][500] = new Casilla(this.stage,this.queue,682,1294,'H',500,true);
        this.casillasMeta["amarilla"][501] = new Casilla(this.stage,this.queue,682,1246,'H',501,true);
        this.casillasMeta["amarilla"][502] = new Casilla(this.stage,this.queue,682,1198,'H',502,true);
        this.casillasMeta["amarilla"][503] = new Casilla(this.stage,this.queue,682,1150,'H',503,true);
        this.casillasMeta["amarilla"][504] = new Casilla(this.stage,this.queue,682,1104,'H',504,true);
        this.casillasMeta["amarilla"][505] = new Casilla(this.stage,this.queue,682,1056,'H',505,true);
        this.casillasMeta["amarilla"][506] = new Casilla(this.stage,this.queue,682,1009,'H',506,true);

        this.casillasMeta["roja"][300] = new Casilla(this.stage,this.queue,58,679,'V',300,true);
        this.casillasMeta["roja"][301] = new Casilla(this.stage,this.queue,106,679,'V',301,true);
        this.casillasMeta["roja"][302] = new Casilla(this.stage,this.queue,154,679,'V',302,true);
        this.casillasMeta["roja"][303] = new Casilla(this.stage,this.queue,202,679,'V',303,true);
        this.casillasMeta["roja"][304] = new Casilla(this.stage,this.queue,250,679,'V',304,true);
        this.casillasMeta["roja"][305] = new Casilla(this.stage,this.queue,298,679,'V',305,true);
        this.casillasMeta["roja"][306] = new Casilla(this.stage,this.queue,344,679,'V',306,true);

        this.casillasMeta["morada"][700] = new Casilla(this.stage,this.queue,675,59,'H',700,true);
        this.casillasMeta["morada"][701] = new Casilla(this.stage,this.queue,675,107,'H',701,true);
        this.casillasMeta["morada"][702] = new Casilla(this.stage,this.queue,675,155,'H',702,true);
        this.casillasMeta["morada"][703] = new Casilla(this.stage,this.queue,675,202,'H',703,true);
        this.casillasMeta["morada"][704] = new Casilla(this.stage,this.queue,675,250,'H',704,true);
        this.casillasMeta["morada"][705] = new Casilla(this.stage,this.queue,675,298,'H',705,true);
        this.casillasMeta["morada"][706] = new Casilla(this.stage,this.queue,675,346,'H',706,true);

        this.casillasMeta["naranja"][600] = new Casilla(this.stage,this.queue,1296,675,'V',600,true);
        this.casillasMeta["naranja"][601] = new Casilla(this.stage,this.queue,1248,675,'V',601,true);
        this.casillasMeta["naranja"][602] = new Casilla(this.stage,this.queue,1200,675,'V',602,true);
        this.casillasMeta["naranja"][603] = new Casilla(this.stage,this.queue,1150,675,'V',603,true);
        this.casillasMeta["naranja"][604] = new Casilla(this.stage,this.queue,1102,675,'V',604,true);
        this.casillasMeta["naranja"][605] = new Casilla(this.stage,this.queue,1054,675,'V',605,true);
        this.casillasMeta["naranja"][606] = new Casilla(this.stage,this.queue,1007,675,'V',606,true);

        this.casillasMeta["azul"][200] = new Casilla(this.stage,this.queue,237,241,'HH',200,true);
        this.casillasMeta["azul"][201] = new Casilla(this.stage,this.queue,270,274,'HH',201,true);
        this.casillasMeta["azul"][202] = new Casilla(this.stage,this.queue,303,307,'HH',202,true);
        this.casillasMeta["azul"][203] = new Casilla(this.stage,this.queue,339,343,'HH',203,true);
        this.casillasMeta["azul"][204] = new Casilla(this.stage,this.queue,372,376,'HH',204,true);
        this.casillasMeta["azul"][205] = new Casilla(this.stage,this.queue,405,409,'HH',205,true);
        this.casillasMeta["azul"][206] = new Casilla(this.stage,this.queue,439,443,'HH',206,true);

        this.casillasMeta["verdeOs"][900] = new Casilla(this.stage,this.queue,245,1121,'VV',900,true);
        this.casillasMeta["verdeOs"][901] = new Casilla(this.stage,this.queue,278,1088,'VV',901,true);
        this.casillasMeta["verdeOs"][902] = new Casilla(this.stage,this.queue,312,1054,'VV',902,true);
        this.casillasMeta["verdeOs"][903] = new Casilla(this.stage,this.queue,346,1020,'VV',903,true);
        this.casillasMeta["verdeOs"][904] = new Casilla(this.stage,this.queue,380,986,'VV',904,true);
        this.casillasMeta["verdeOs"][905] = new Casilla(this.stage,this.queue,414,952,'VV',905,true);
        this.casillasMeta["verdeOs"][906] = new Casilla(this.stage,this.queue,448,918,'VV',906,true);

        this.casillasMeta["verde"][400] = new Casilla(this.stage,this.queue,1113,238,'VV',400,true);
        this.casillasMeta["verde"][401] = new Casilla(this.stage,this.queue,1080,271,'VV',401,true);
        this.casillasMeta["verde"][402] = new Casilla(this.stage,this.queue,1046,305,'VV',402,true);
        this.casillasMeta["verde"][403] = new Casilla(this.stage,this.queue,1012,339,'VV',403,true);
        this.casillasMeta["verde"][404] = new Casilla(this.stage,this.queue,978,373,'VV',404,true);
        this.casillasMeta["verde"][405] = new Casilla(this.stage,this.queue,944,407,'VV',405,true);
        this.casillasMeta["verde"][406] = new Casilla(this.stage,this.queue,910,441,'VV',406,true);

        this.casillasMeta["cyan"][800] = new Casilla(this.stage,this.queue,1117,1112,'HH',800,true);
        this.casillasMeta["cyan"][801] = new Casilla(this.stage,this.queue,1084,1079,'HH',801,true);
        this.casillasMeta["cyan"][802] = new Casilla(this.stage,this.queue,1050,1045,'HH',802,true);
        this.casillasMeta["cyan"][803] = new Casilla(this.stage,this.queue,1016,1011,'HH',803,true);
        this.casillasMeta["cyan"][804] = new Casilla(this.stage,this.queue,983,978,'HH',804,true);
        this.casillasMeta["cyan"][805] = new Casilla(this.stage,this.queue,950,940,'HH',805,true);
        this.casillasMeta["cyan"][806] = new Casilla(this.stage,this.queue,917,907,'HH',806,true);

    }
    
    //casillas de fin de meta
    fichasFin(bool){
        this.casillasFin["azul"][207] = new Casilla(this.stage,this.queue,565,493,'H',207,true);
        this.casillasFin["azul"][208] = new Casilla(this.stage,this.queue,565,453,'H',208,true);
        this.casillasFin["azul"][209] = new Casilla(this.stage,this.queue,565,533,'H',209,true);
        this.casillasFin["azul"][210] = new Casilla(this.stage,this.queue,565,413,'H',210,true);

        this.casillasFin["roja"][307] = new Casilla(this.stage,this.queue,493,384,'V',307,true);
        this.casillasFin["roja"][308] = new Casilla(this.stage,this.queue,453,384,'V',308,true);
        this.casillasFin["roja"][309] = new Casilla(this.stage,this.queue,533,384,'V',309,true);
        this.casillasFin["roja"][310] = new Casilla(this.stage,this.queue,413,384,'V',310,true);

    	this.casillasFin["verde"][407] = new Casilla(this.stage,this.queue,384,493,'H',407,true);
        this.casillasFin["verde"][408] = new Casilla(this.stage,this.queue,384,453,'H',408,true);
        this.casillasFin["verde"][409] = new Casilla(this.stage,this.queue,384,533,'H',409,true);
        this.casillasFin["verde"][410] = new Casilla(this.stage,this.queue,384,413,'H',410,true);

    	this.casillasFin["amarilla"][507] = new Casilla(this.stage,this.queue,493,564,'V',507,true);
        this.casillasFin["amarilla"][508] = new Casilla(this.stage,this.queue,453,564,'V',508,true);
        this.casillasFin["amarilla"][509] = new Casilla(this.stage,this.queue,533,564,'V',509,true);
        this.casillasFin["amarilla"][510] = new Casilla(this.stage,this.queue,413,564,'V',510,true);
    }
    fichasFin8(color, xIni, yIni, sep,FinP,n){

        if(FinP==1){
            this.casillasFin[color][n+7]= new Casilla(this.stage,this.queue,xIni+sep,yIni,'',n+7,true);
            this.casillasFin[color][n+8]= new Casilla(this.stage,this.queue,xIni-sep,yIni,'',n+8,true);
            this.casillasFin[color][n+9]= new Casilla(this.stage,this.queue,xIni,yIni-sep,'',n+9,true);
            this.casillasFin[color][n+10]= new Casilla(this.stage,this.queue,xIni,yIni+sep,'',n+10,true);
        }
        else{
            sep-=10;
            this.casillasFin[color][n+7]= new Casilla(this.stage,this.queue,xIni-sep,yIni - sep,'',n+7,true);
            this.casillasFin[color][n+8]= new Casilla(this.stage,this.queue,xIni+sep,yIni-sep,'',n+8,true);
            this.casillasFin[color][n+9]= new Casilla(this.stage,this.queue,xIni-sep,yIni+sep,'',n+9,true);
            this.casillasFin[color][n+10]= new Casilla(this.stage,this.queue,xIni+sep,yIni+sep,'',n+10,true);
        }
    }

    //crear con parametro de las 12 casillas y puesto inicial de cada una por si recarga de página y partida ya empezada....*************+
    //????
    dibujarTableroInicial(){


        this.casillasCampo[1]= new Casilla(this.stage,this.queue,580,942,'H',1,false);
        this.casillasCampo[2]= new Casilla(this.stage,this.queue,580,895,'H',2,false);
        this.casillasCampo[3]= new Casilla(this.stage,this.queue,580,848,'H',3,false);
        this.casillasCampo[4]= new Casilla(this.stage,this.queue,580,801,'H',4,false);
        this.casillasCampo[5]= new Casilla(this.stage,this.queue,580,753,'H',5,false);
        this.casillasCampo[6]= new Casilla(this.stage,this.queue,580,705,'H',6,false);
        this.casillasCampo[7]= new Casilla(this.stage,this.queue,580,658,'H',7,false);
        this.casillasCampo[8]= new Casilla(this.stage,this.queue,580,611,'H',8,false);
        this.casillasCampo[9]= new Casilla(this.stage,this.queue,607,580,'V',9,false);
        this.casillasCampo[10]= new Casilla(this.stage,this.queue,654,580,'V',10,false);
        this.casillasCampo[11]= new Casilla(this.stage,this.queue,701,580,'V',11,false);
        this.casillasCampo[12]= new Casilla(this.stage,this.queue,748,580,'V',12,false);
        this.casillasCampo[13]= new Casilla(this.stage,this.queue,795,580,'V',13,false);
        this.casillasCampo[14]= new Casilla(this.stage,this.queue,842,580,'V',14,false);
        this.casillasCampo[15]= new Casilla(this.stage,this.queue,889,580,'V',15,false);
        this.casillasCampo[16]= new Casilla(this.stage,this.queue,940,580,'V',16,false);

        this.casillasCampo[17]= new Casilla(this.stage,this.queue,940,477,'V',17,false);

        this.casillasCampo[18]= new Casilla(this.stage,this.queue,940,370,'V',18,false);
        this.casillasCampo[19]= new Casilla(this.stage,this.queue,889,370,'V',19,false);
        this.casillasCampo[20]= new Casilla(this.stage,this.queue,842,370,'V',20,false);
        this.casillasCampo[21]= new Casilla(this.stage,this.queue,795,370,'V',21,false);
        this.casillasCampo[22]= new Casilla(this.stage,this.queue,748,370,'V',22,false);
        this.casillasCampo[23]= new Casilla(this.stage,this.queue,701,370,'V',23,false);
        this.casillasCampo[24]= new Casilla(this.stage,this.queue,654,370,'V',24,false);
        this.casillasCampo[25]= new Casilla(this.stage,this.queue,607,370,'V',25,false);
        this.casillasCampo[26]= new Casilla(this.stage,this.queue,580,337,'H',26,false);
        this.casillasCampo[27]= new Casilla(this.stage,this.queue,580,290,'H',27,false);
        this.casillasCampo[28]= new Casilla(this.stage,this.queue,580,243,'H',28,false);
        this.casillasCampo[29]= new Casilla(this.stage,this.queue,580,196,'H',29,false);
        this.casillasCampo[30]= new Casilla(this.stage,this.queue,580,149,'H',30,false);
        this.casillasCampo[31]= new Casilla(this.stage,this.queue,580,102,'H',31,false);
        this.casillasCampo[32]= new Casilla(this.stage,this.queue,580,55,'H',32,false);
        this.casillasCampo[33]= new Casilla(this.stage,this.queue,580,8,'H',33,false);

        this.casillasCampo[34]= new Casilla(this.stage,this.queue,475,8,'H',34,false);

        this.casillasCampo[35]= new Casilla(this.stage,this.queue,367,8,'H',35,false);
        this.casillasCampo[36]= new Casilla(this.stage,this.queue,367,55,'H',36,false);
        this.casillasCampo[37]= new Casilla(this.stage,this.queue,367,102,'H',37,false);
        this.casillasCampo[38]= new Casilla(this.stage,this.queue,367,149,'H',38,false);
        this.casillasCampo[39]= new Casilla(this.stage,this.queue,367,196,'H',39,false);
        this.casillasCampo[40]= new Casilla(this.stage,this.queue,367,243,'H',40,false);
        this.casillasCampo[41]= new Casilla(this.stage,this.queue,367,290,'H',41,false);
        this.casillasCampo[42]= new Casilla(this.stage,this.queue,367,337,'H',42,false);
        this.casillasCampo[43]= new Casilla(this.stage,this.queue,337,370,'V',43,false);
        this.casillasCampo[44]= new Casilla(this.stage,this.queue,290,370,'V',44,false);
        this.casillasCampo[45]= new Casilla(this.stage,this.queue,243,370,'V',45,false);
        this.casillasCampo[46]= new Casilla(this.stage,this.queue,196,370,'V',46,false);
        this.casillasCampo[47]= new Casilla(this.stage,this.queue,149,370,'V',47,false);
        this.casillasCampo[48]= new Casilla(this.stage,this.queue,102,370,'V',48,false);
        this.casillasCampo[49]= new Casilla(this.stage,this.queue,55,370,'V',49,false);
        this.casillasCampo[50]= new Casilla(this.stage,this.queue,8,370,'V',50,false);

        this.casillasCampo[51]= new Casilla(this.stage,this.queue,8,473,'V',51,false);

        this.casillasCampo[52]= new Casilla(this.stage,this.queue,8,580,'V',52,false);
        this.casillasCampo[53]= new Casilla(this.stage,this.queue,55,580,'V',53,false);
        this.casillasCampo[54]= new Casilla(this.stage,this.queue,102,580,'V',54,false);
        this.casillasCampo[55]= new Casilla(this.stage,this.queue,149,580,'V',55,false);
        this.casillasCampo[56]= new Casilla(this.stage,this.queue,196,580,'V',56,false);
        this.casillasCampo[57]= new Casilla(this.stage,this.queue,243,580,'V',57,false);
        this.casillasCampo[58]= new Casilla(this.stage,this.queue,290,580,'V',58,false);
        this.casillasCampo[59]= new Casilla(this.stage,this.queue,337,580,'V',59,false);
        this.casillasCampo[60]= new Casilla(this.stage,this.queue,367,611,'H',60,false);
        this.casillasCampo[61]= new Casilla(this.stage,this.queue,367,658,'H',61,false);
        this.casillasCampo[62]= new Casilla(this.stage,this.queue,367,705,'H',62,false);
        this.casillasCampo[63]= new Casilla(this.stage,this.queue,367,753,'H',63,false);
        this.casillasCampo[64]= new Casilla(this.stage,this.queue,367,801,'H',64,false);
        this.casillasCampo[65]= new Casilla(this.stage,this.queue,367,848,'H',65,false);
        this.casillasCampo[66]= new Casilla(this.stage,this.queue,367,895,'H',66,false);
        this.casillasCampo[67]= new Casilla(this.stage,this.queue,367,942,'H',67,false);

        this.casillasCampo[68]= new Casilla(this.stage,this.queue,475,942,'H',68,false);

        //+++++faltan casillasespeciales de llegada a meta*******************************************************+


        this.casillasCasa["roja"] = []; this.casillasCasa["amarilla"] = [];
        this.casillasCasa["verde"] = []; this.casillasCasa["azul"] = [];
        this.fichas["roja"] = []; this.fichas["amarilla"] = [];
        this.fichas["verde"] = []; this.fichas["azul"] = [];

        //casillas que avanzan hasta la meta
        this.casillasMeta["roja"] = []; this.casillasMeta["amarilla"] = [];
        this.casillasMeta["verde"] = []; this.casillasMeta["azul"] = [];
        this.fichasMeta();
        //casillas de fin de meta
        this.casillasFin["roja"] = []; this.casillasFin["amarilla"] = [];
        this.casillasFin["verde"] = []; this.casillasFin["azul"] = [];
        this.fichasFin();

        let sep = 125;
        let escala = 2.0;
        this.fichasInit("roja",60,60,sep,escala);
        this.fichasInit("verde",60,725,sep,escala);
        this.fichasInit("azul",725,60,sep,escala);
        this.fichasInit("amarilla",725,725,sep,escala);

        this.fichas["roja"][0].asignarFichas(this.fichas);
        this.fichas["roja"][1].asignarFichas(this.fichas);
        this.fichas["roja"][2].asignarFichas(this.fichas);
        this.fichas["roja"][3].asignarFichas(this.fichas);
        this.fichas["verde"][0].asignarFichas(this.fichas);
        this.fichas["verde"][1].asignarFichas(this.fichas);
        this.fichas["verde"][2].asignarFichas(this.fichas);
        this.fichas["verde"][3].asignarFichas(this.fichas);
        this.fichas["azul"][0].asignarFichas(this.fichas);
        this.fichas["azul"][1].asignarFichas(this.fichas);
        this.fichas["azul"][2].asignarFichas(this.fichas);
        this.fichas["azul"][3].asignarFichas(this.fichas);
        this.fichas["amarilla"][0].asignarFichas(this.fichas);
        this.fichas["amarilla"][1].asignarFichas(this.fichas);
        this.fichas["amarilla"][2].asignarFichas(this.fichas);
        this.fichas["amarilla"][3].asignarFichas(this.fichas);
        

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

    dibujarTableroInicial8(){
        this.casillasCampo[1]= new Casilla(this.stage,this.queue,780,1342,'H',1);
        this.casillasCampo[2]= new Casilla(this.stage,this.queue,780,1294,'H',2);
        this.casillasCampo[3]= new Casilla(this.stage,this.queue,780,1246,'H',3);
        this.casillasCampo[4]= new Casilla(this.stage,this.queue,780,1198,'H',4);
        this.casillasCampo[5]= new Casilla(this.stage,this.queue,780,1150,'H',5);
        this.casillasCampo[6]= new Casilla(this.stage,this.queue,780,1104,'H',6);
        this.casillasCampo[7]= new Casilla(this.stage,this.queue,780,1056,'H',7);
        this.casillasCampo[8]= new Casilla(this.stage,this.queue,780,1009,'H',8);
        this.casillasCampo[9]= new Casilla(this.stage,this.queue,845,980,'HH',9);
        this.casillasCampo[10]= new Casilla(this.stage,this.queue,879,1014,'HH',10);
        this.casillasCampo[11]= new Casilla(this.stage,this.queue,913,1048,'HH',11);
        this.casillasCampo[12]= new Casilla(this.stage,this.queue,947,1082,'HH',12);
        this.casillasCampo[13]= new Casilla(this.stage,this.queue,980,1115,'HH',13);
        this.casillasCampo[14]= new Casilla(this.stage,this.queue,1013,1148,'HH',14);
        this.casillasCampo[15]= new Casilla(this.stage,this.queue,1046,1181,'HH',15);
        this.casillasCampo[16]= new Casilla(this.stage,this.queue,1080,1215,'HH',16);
        this.casillasCampo[17]= new Casilla(this.stage,this.queue,1150,1145,'HH',17);
        this.casillasCampo[18]= new Casilla(this.stage,this.queue,1220,1075,'HH',18);
        this.casillasCampo[19]= new Casilla(this.stage,this.queue,1186,1041,'HH',19);
        this.casillasCampo[20]= new Casilla(this.stage,this.queue,1153,1008,'HH',20);
        this.casillasCampo[21]= new Casilla(this.stage,this.queue,1120,975,'HH',21);
        this.casillasCampo[22]= new Casilla(this.stage,this.queue,1087,941,'HH',22);
        this.casillasCampo[23]= new Casilla(this.stage,this.queue,1053,908,'HH',23);
        this.casillasCampo[24]= new Casilla(this.stage,this.queue,1019,874,'HH',24);
        this.casillasCampo[25]= new Casilla(this.stage,this.queue,985,840,'HH',25);
        this.casillasCampo[26]= new Casilla(this.stage,this.queue,1010,778,'V',26);
        this.casillasCampo[27]= new Casilla(this.stage,this.queue,1058,778,'V',27);
        this.casillasCampo[28]= new Casilla(this.stage,this.queue,1106,778,'V',28);
        this.casillasCampo[29]= new Casilla(this.stage,this.queue,1154,778,'V',29);
        this.casillasCampo[30]= new Casilla(this.stage,this.queue,1202,778,'V',30);
        this.casillasCampo[31]= new Casilla(this.stage,this.queue,1250,778,'V',31);
        this.casillasCampo[32]= new Casilla(this.stage,this.queue,1298,778,'V',32);        
        this.casillasCampo[33]= new Casilla(this.stage,this.queue,1344,778,'V',33);
        this.casillasCampo[34]= new Casilla(this.stage,this.queue,1344,675,'V',34);
        this.casillasCampo[35]= new Casilla(this.stage,this.queue,1344,578,'V',35);
        this.casillasCampo[36]= new Casilla(this.stage,this.queue,1296,578,'V',36);
        this.casillasCampo[37]= new Casilla(this.stage,this.queue,1248,578,'V',37);
        this.casillasCampo[38]= new Casilla(this.stage,this.queue,1200,578,'V',38);
        this.casillasCampo[39]= new Casilla(this.stage,this.queue,1150,578,'V',39);
        this.casillasCampo[40]= new Casilla(this.stage,this.queue,1102,578,'V',40);
        this.casillasCampo[41]= new Casilla(this.stage,this.queue,1054,578,'V',41);
        this.casillasCampo[42]= new Casilla(this.stage,this.queue,1007,578,'V',42);
        this.casillasCampo[43]= new Casilla(this.stage,this.queue,985,516,'VV',43);
        this.casillasCampo[44]= new Casilla(this.stage,this.queue,1015,480,'VV',44);
        this.casillasCampo[45]= new Casilla(this.stage,this.queue,1049,446,'VV',45);
        this.casillasCampo[46]= new Casilla(this.stage,this.queue,1082,413,'VV',46);
        this.casillasCampo[47]= new Casilla(this.stage,this.queue,1116,379,'VV',47);
        this.casillasCampo[48]= new Casilla(this.stage,this.queue,1150,345,'VV',48);
        this.casillasCampo[49]= new Casilla(this.stage,this.queue,1184,311,'VV',49);
        this.casillasCampo[50]= new Casilla(this.stage,this.queue,1218,277,'VV',50);
        this.casillasCampo[51]= new Casilla(this.stage,this.queue,1146,205,'VV',51);
        this.casillasCampo[52]= new Casilla(this.stage,this.queue,1076,135,'VV',52);
        this.casillasCampo[53]= new Casilla(this.stage,this.queue,1042,169,'VV',53);
        this.casillasCampo[54]= new Casilla(this.stage,this.queue,1009,202,'VV',54);
        this.casillasCampo[55]= new Casilla(this.stage,this.queue,975,236,'VV',55);
        this.casillasCampo[56]= new Casilla(this.stage,this.queue,942,269,'VV',56);
        this.casillasCampo[57]= new Casilla(this.stage,this.queue,909,302,'VV',57);
        this.casillasCampo[58]= new Casilla(this.stage,this.queue,876,335,'VV',58);
        this.casillasCampo[59]= new Casilla(this.stage,this.queue,843,368,'VV',59);
        this.casillasCampo[60]= new Casilla(this.stage,this.queue,776,345,'H',60);
        this.casillasCampo[61]= new Casilla(this.stage,this.queue,776,298,'H',61);
        this.casillasCampo[62]= new Casilla(this.stage,this.queue,776,250,'H',62);
        this.casillasCampo[63]= new Casilla(this.stage,this.queue,776,202,'H',63);
        this.casillasCampo[64]= new Casilla(this.stage,this.queue,776,154,'H',64);
        this.casillasCampo[65]= new Casilla(this.stage,this.queue,776,106,'H',65);
        this.casillasCampo[66]= new Casilla(this.stage,this.queue,776,58,'H',66);
        this.casillasCampo[67]= new Casilla(this.stage,this.queue,776,12,'H',67);
        this.casillasCampo[68]= new Casilla(this.stage,this.queue,675,12,'H',68);
        this.casillasCampo[69]= new Casilla(this.stage,this.queue,576,12,'H',69);
        this.casillasCampo[70]= new Casilla(this.stage,this.queue,576,59,'H',70);
        this.casillasCampo[71]= new Casilla(this.stage,this.queue,576,107,'H',71);
        this.casillasCampo[72]= new Casilla(this.stage,this.queue,576,155,'H',72);
        this.casillasCampo[73]= new Casilla(this.stage,this.queue,576,202,'H',73);
        this.casillasCampo[74]= new Casilla(this.stage,this.queue,576,250,'H',74);
        this.casillasCampo[75]= new Casilla(this.stage,this.queue,576,298,'H',75);
        this.casillasCampo[76]= new Casilla(this.stage,this.queue,576,346,'H',76);
        this.casillasCampo[77]= new Casilla(this.stage,this.queue,510,370,'HH',77);
        this.casillasCampo[78]= new Casilla(this.stage,this.queue,479,339,'HH',78);
        this.casillasCampo[79]= new Casilla(this.stage,this.queue,445,305,'HH',79);
        this.casillasCampo[80]= new Casilla(this.stage,this.queue,411,271,'HH',80);
        this.casillasCampo[81]= new Casilla(this.stage,this.queue,377,237,'HH',81);
        this.casillasCampo[82]= new Casilla(this.stage,this.queue,343,203,'HH',82);
        this.casillasCampo[83]= new Casilla(this.stage,this.queue,309,169,'HH',83);
        this.casillasCampo[84]= new Casilla(this.stage,this.queue,274,135,'HH',84);
        this.casillasCampo[85]= new Casilla(this.stage,this.queue,204,208,'HH',85);
        this.casillasCampo[86]= new Casilla(this.stage,this.queue,134,278,'HH',86);
        this.casillasCampo[87]= new Casilla(this.stage,this.queue,178,312,'HH',87);
        this.casillasCampo[88]= new Casilla(this.stage,this.queue,202,346,'HH',88);
        this.casillasCampo[89]= new Casilla(this.stage,this.queue,235,379,'HH',89);
        this.casillasCampo[90]= new Casilla(this.stage,this.queue,269,413,'HH',90);
        this.casillasCampo[91]= new Casilla(this.stage,this.queue,303,447,'HH',91);
        this.casillasCampo[92]= new Casilla(this.stage,this.queue,337,481,'HH',92);
        this.casillasCampo[93]= new Casilla(this.stage,this.queue,371,515,'HH',93);
        this.casillasCampo[94]= new Casilla(this.stage,this.queue,344,578,'V',94);
        this.casillasCampo[95]= new Casilla(this.stage,this.queue,298,578,'V',95);
        this.casillasCampo[96]= new Casilla(this.stage,this.queue,250,578,'V',96);
        this.casillasCampo[97]= new Casilla(this.stage,this.queue,202,578,'V',97);
        this.casillasCampo[98]= new Casilla(this.stage,this.queue,154,578,'V',98);
        this.casillasCampo[99]= new Casilla(this.stage,this.queue,106,578,'V',99);
        this.casillasCampo[100]= new Casilla(this.stage,this.queue,58,578,'V',100);
        this.casillasCampo[101]= new Casilla(this.stage,this.queue,9,578,'V',101);
        this.casillasCampo[102]= new Casilla(this.stage,this.queue,9,679,'V',102);
        this.casillasCampo[103]= new Casilla(this.stage,this.queue,9,778,'V',103);
        this.casillasCampo[104]= new Casilla(this.stage,this.queue,58,778,'V',104);
        this.casillasCampo[105]= new Casilla(this.stage,this.queue,106,778,'V',105);
        this.casillasCampo[106]= new Casilla(this.stage,this.queue,154,778,'V',106);
        this.casillasCampo[107]= new Casilla(this.stage,this.queue,202,778,'V',107);
        this.casillasCampo[108]= new Casilla(this.stage,this.queue,250,778,'V',108);
        this.casillasCampo[109]= new Casilla(this.stage,this.queue,298,778,'V',109);
        this.casillasCampo[110]= new Casilla(this.stage,this.queue,344,778,'V',110);
        this.casillasCampo[111]= new Casilla(this.stage,this.queue,375,845,'VV',111);
        this.casillasCampo[112]= new Casilla(this.stage,this.queue,341,879,'VV',112);
        this.casillasCampo[113]= new Casilla(this.stage,this.queue,307,913,'VV',113);
        this.casillasCampo[114]= new Casilla(this.stage,this.queue,273,947,'VV',114);
        this.casillasCampo[115]= new Casilla(this.stage,this.queue,239,981,'VV',115);
        this.casillasCampo[116]= new Casilla(this.stage,this.queue,205,1015,'VV',116);
        this.casillasCampo[117]= new Casilla(this.stage,this.queue,172,1048,'VV',117);
        this.casillasCampo[118]= new Casilla(this.stage,this.queue,139,1081,'VV',118);
        this.casillasCampo[119]= new Casilla(this.stage,this.queue,212,1154,'VV',119);
        this.casillasCampo[120]= new Casilla(this.stage,this.queue,285,1227,'VV',120);
        this.casillasCampo[121]= new Casilla(this.stage,this.queue,317,1186,'VV',121);
        this.casillasCampo[122]= new Casilla(this.stage,this.queue,349,1151,'VV',122);
        this.casillasCampo[123]= new Casilla(this.stage,this.queue,381,1117,'VV',123);
        this.casillasCampo[124]= new Casilla(this.stage,this.queue,413,1085,'VV',124); 
        this.casillasCampo[125]= new Casilla(this.stage,this.queue,445,1050,'VV',125);
        this.casillasCampo[126]= new Casilla(this.stage,this.queue,477,1015,'VV',126);
        this.casillasCampo[127]= new Casilla(this.stage,this.queue,509,980,'VV',127);
        this.casillasCampo[128]= new Casilla(this.stage,this.queue,580,1009,'H',128);
        this.casillasCampo[129]= new Casilla(this.stage,this.queue,580,1056,'H',129);
        this.casillasCampo[130]= new Casilla(this.stage,this.queue,580,1104,'H',130);
        this.casillasCampo[131]= new Casilla(this.stage,this.queue,580,1150,'H',131);
        this.casillasCampo[132]= new Casilla(this.stage,this.queue,580,1198,'H',132);
        this.casillasCampo[133]= new Casilla(this.stage,this.queue,580,1246,'H',133);
        this.casillasCampo[134]= new Casilla(this.stage,this.queue,580,1294,'H',134);
        this.casillasCampo[135]= new Casilla(this.stage,this.queue,580,1342,'H',135);
        this.casillasCampo[136]= new Casilla(this.stage,this.queue,682,1342,'H',136);
        
        
        this.casillasCasa["roja"] = []; this.casillasCasa["amarilla"] = [];
        this.casillasCasa["verdeOs"] = []; this.casillasCasa["azul"] = [];
        this.casillasCasa["morada"] = []; this.casillasCasa["naranja"] = [];
        this.casillasCasa["verde"] = []; this.casillasCasa["cyan"] = [];
       
        this.fichas["roja"] = []; this.fichas["amarilla"] = [];
        this.fichas["verdeOs"] = []; this.fichas["azul"] = [];
        this.fichas["morada"] = []; this.fichas["naranja"] = [];
        this.fichas["verde"] = []; this.fichas["cyan"] = [];
       
        //casillas que avanzan hasta la meta
        this.casillasMeta["roja"] = []; this.casillasMeta["amarilla"] = [];
        this.casillasMeta["verdeOs"] = []; this.casillasMeta["azul"] = [];
        this.casillasMeta["morada"] = []; this.casillasMeta["naranja"] = [];
        this.casillasMeta["verde"] = []; this.casillasMeta["cyan"] = [];
        
        //casillas de fin de meta
        this.casillasFin["roja"] = []; this.casillasFin["amarilla"] = [];
        this.casillasFin["verdeOs"] = []; this.casillasFin["azul"] = [];
        this.casillasFin["morada"] = []; this.casillasFin["naranja"] = [];
        this.casillasFin["verde"] = []; this.casillasFin["cyan"] = [];

        let sep =40;
        let escala = 1.6;
        this.fichasInit8("roja",100,905,sep,escala,0);
        console.log("una iniciada");

        this.fichasInit8("verdeOs",440,1230,sep,escala,1);
        this.fichasInit8("azul",95,435,sep,escala,1,"cyan");
        this.fichasInit8("amarilla",905,1220,sep,escala,0);
        this.fichasInit8("morada",420,100,sep,escala,0);//morada
        this.fichasInit8("verde",885,95,sep,escala,1);//verde claro
        this.fichasInit8("cyan",1230,885,sep,escala,1);//azul claro
        this.fichasInit8("naranja",1225,420,sep,escala,0);//naranja
        
        console.log("todas iniciadas co");

        this.fichasFin8("roja",445,675,sep,1,300);   //done
        this.fichasFin8("verdeOs",515,835,sep,0,900);//done
        this.fichasFin8("azul",510,511,sep,0,200);//done
        this.fichasFin8("amarilla",680,910,sep,1,500);//done
        this.fichasFin8("morada",680,440,sep,1,700);//done
        this.fichasFin8("verde",840,510,sep,0,400);//done
        this.fichasFin8("cyan",840,840,sep,0,800);//done
        this.fichasFin8("naranja",910,680,sep,1,600);//done
        
        
        this.fichasMeta8();
        
       
    

        

        this.fichas["roja"][0].asignarFichas(this.fichas);
        this.fichas["roja"][1].asignarFichas(this.fichas);
        this.fichas["roja"][2].asignarFichas(this.fichas);
        this.fichas["roja"][3].asignarFichas(this.fichas);
        this.fichas["verdeOs"][0].asignarFichas(this.fichas);
        this.fichas["verdeOs"][1].asignarFichas(this.fichas);
        this.fichas["verdeOs"][2].asignarFichas(this.fichas);
        this.fichas["verdeOs"][3].asignarFichas(this.fichas);
        this.fichas["azul"][0].asignarFichas(this.fichas);
        this.fichas["azul"][1].asignarFichas(this.fichas);
        this.fichas["azul"][2].asignarFichas(this.fichas);
        this.fichas["azul"][3].asignarFichas(this.fichas);
        this.fichas["amarilla"][0].asignarFichas(this.fichas);
        this.fichas["amarilla"][1].asignarFichas(this.fichas);
        this.fichas["amarilla"][2].asignarFichas(this.fichas);
        this.fichas["amarilla"][3].asignarFichas(this.fichas);
        this.fichas["morada"][0].asignarFichas(this.fichas);
        this.fichas["morada"][1].asignarFichas(this.fichas);
        this.fichas["morada"][2].asignarFichas(this.fichas);
        this.fichas["morada"][3].asignarFichas(this.fichas);
        this.fichas["verde"][0].asignarFichas(this.fichas);
        this.fichas["verde"][1].asignarFichas(this.fichas);
        this.fichas["verde"][2].asignarFichas(this.fichas);
        this.fichas["verde"][3].asignarFichas(this.fichas);
        this.fichas["cyan"][0].asignarFichas(this.fichas);
        this.fichas["cyan"][1].asignarFichas(this.fichas);
        this.fichas["cyan"][2].asignarFichas(this.fichas);
        this.fichas["cyan"][3].asignarFichas(this.fichas);
        this.fichas["naranja"][0].asignarFichas(this.fichas);
        this.fichas["naranja"][1].asignarFichas(this.fichas);
        this.fichas["naranja"][2].asignarFichas(this.fichas);
        this.fichas["naranja"][3].asignarFichas(this.fichas);
        
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
    constructor(stage,queue,x,y,tipo,numero,esMeta){
        this.x = x;
        this.y = y;
        this.meta = esMeta;
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
                else if(this.tipo === 'HH') {
                    num=15;
                    this.ilum.x = this.x + num;
                    this.ilum.y = this.y - num;
                    this.fichas[0].move(this.x - num,this.y + num,200);
                }
                else if(this.tipo === 'VV') {
                    num=15;
                    this.ilum.x = this.x + num;
                    this.ilum.y = this.y + num;
                    this.fichas[0].move(this.x - num,this.y - num,200);
                }
                else if(this.tipo === 'V') {
                    this.ilum.y = this.y + num;
                    this.fichas[0].move(this.x,this.y - num,200);
                }
            }

            createjs.Tween.get(this.ilum,{loop: true}).to({alpha: 0.5}, 300).wait(400).to({alpha: 0.0}, 200);
        }

    }
    

    iluminarComer(ficha){


        if(this.fichaIlum===null){ //si no está iluminada parpadeando

            //ficha.escalaReal=2
            this.fichaIlum=ficha;
            this.ilum.cursor="pointer";

            let nuevoBitMap = new createjs.Bitmap(this.imagenes[this.fichaIlum.color]);
            //let nuevoBitMap = new createjs.Bitmap(document.getElementById(this.fichaIlum.color));
            this.ilum.image = nuevoBitMap.image;
            //this.ilum.alpha=2.0;
            if(ficha.numJugadores===4){
                this.ilum.scaleX = 2.0;
                this.ilum.scaleY = 2.0;
                this.ilum.x = this.x-24;
                this.ilum.y= this.y-26;
            }
            else{
                this.ilum.scaleX = 1.6;
                this.ilum.scaleY = 1.6;
                this.ilum.x = this.x-17;
                this.ilum.y= this.y-18;
            }
           

            
            

            createjs.Tween.get(this.ilum,{loop: true}).to({alpha: 0.5}, 300).wait(400).to({alpha: 0.0}, 200);
        }

    }

    noIluminar(){
        if(this.fichaIlum !== null){ //si esta iluminada parpadeando
            this.ilum.scaleX = 1.0;
            this.ilum.scaleY = 1.0;  
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
    constructor(stage,queue,color,casilla,listeners,esc,numero,casillasCampo,casillasCasa,casillasMeta,casillasFin,fichasTot,socket,
        numJugadores,pareja){
        this.casilla = casilla;
        this.casilla.estaOcupada=true;
        this.casilla.fichas[0]=this;
        this.color = color;
        this.imagenes = queue;
        this.numero = numero;
        this.socket = socket;
        this.numJugadores=numJugadores;
        this.pareja = pareja //'' si no tiene

        //mirar de hacer acceso a casillas y fichas desde game y no desde clase fichaa???***********
        this.casillasCampo = casillasCampo;
        this.casillasCasa = casillasCasa;
        this.casillasMeta = casillasMeta;
        this.casillasFin = casillasFin;
        this.fichasTot = fichasTot;
        this.fichas = ["roja","amarilla","verde","azul"];
        //***************************************************************************************


        this.token = new createjs.Bitmap(this.imagenes[this.color]);
        //this.token = new createjs.Bitmap(document.getElementById(this.color));
        this.token.x = this.casilla.x;
        this.token.y = this.casilla.y;
        this.token.scaleX = this.token.scaleY = esc;

        this.escalaReal = esc;
        this.enMovimiento = false;
        this.seleccionada = false;

        this.turno = false;


        //solo para probar, los movs hay que solicitarlos al servidor**********************
        //BORRAR
        /*this.posiblesMovs = [
            [5,9,11,12], //para ficha 0
            [3,2,67,10], //para ficha 1
            [6,35,51,64], //para ficha 2
            [12,35,41,28] //para ficha 3
        ]; */
        this.lugarMov = []
        this.posiblesMovs = []

        //**********************************************************************************


        stage.addChild(this.token);


        if(listeners){

            this.imgClick = new createjs.Bitmap(this.imagenes[this.color+"Click"]).image;
            this.imgNormal = new createjs.Bitmap(this.imagenes[this.color]).image;
            
            this.token.addEventListener("click", () => {
                
                if(!this.enMovimiento && !this.seleccionada && this.turno ){

                    this.seleccionada = true;
                    createjs.Tween.get(this.token)
                        .to({alpha: 0.4},200)
                        .to({image: this.imgClick},50)
                        .to({alpha: 1.0},200);


                    

                    //y ocultar los movs del resto si hubiera alguna activo, a modo de switch en la selección
                    this.fichasTot[this.color].forEach((f,i) =>{
                        if(i!==this.numero) f.ocultarMovimientos(true);
                    })
                    //y ocultar los de la pareja también para hacer switch con ella, en caso de tenerla
                    if(this.pareja) this.fichasTot[this.pareja].forEach(f=>{f.ocultarMovimientos(true)})

                    this.mostrarMovimientos(); 


                } else if (!this.enMovimiento && this.seleccionada && this.turno){
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

    asignarFichas(fichas){
        this.fichas = fichas
        console.log("Fichas: "+fichas)
    }

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
                    this.casilla.fichas[0].token.x = this.casilla.x - num;
                    this.casilla.fichas[1].token.x = this.casilla.x + num;
            }
            else if(this.casilla.tipo === 'V') {    //intersecciones modificadas para que entren las barreras
                    this.casilla.fichas[0].token.y = this.casilla.y - num;
                    this.casilla.fichas[1].token.y = this.casilla.y + num;
            }

        }else{
            this.casilla.estaOcupada = true;
            this.casilla.fichas[0] = this;
        }
    }

    componerRuta(casillas,desde,hasta,casillasMeta,casillasFin,estado){
        let casillasMov = [];
        let i = 0;
        let nCasillas=68;
        if(this.numJugadores===8) nCasillas=136;
        if(desde === 0){ //ficha en casa
            let nSalida = 5; //amarilla
            if(this.numJugadores===4){
                if(this.color === "azul") nSalida = 22;
                if(this.color === "roja") nSalida = 39;
                if(this.color === "verde") nSalida = 56;
            }
            else{
                if(this.color === "azul") nSalida = 90;
                if(this.color === "roja") nSalida = 106;
                if(this.color === "verdeOs") nSalida = 124;
                if(this.color === "cyan") nSalida = 22;
                if(this.color === "verde") nSalida = 56;
                if(this.color === "morada") nSalida = 73;
                if(this.color === "naranja") nSalida = 39;
            }
            casillasMov[i] = casillas[nSalida]; i++;
            desde = nSalida;
        }
        console.log("ESTADOO 1111111111 " +estado)
        if(estado === "FUERA"){
            console.log("ESTADOO 222222222222 " +estado)
            for(let j=desde+1;j<=hasta;j++){
                casillasMov[i] = casillas[j];
                i++;
            }
            if(hasta < desde){
                for(let j=desde+1;j<=nCasillas;j++){
                    casillasMov[i] = casillas[j];
                    i++;
                }
                for(let j=1; j<=hasta;j++){
                    casillasMov[i] = casillas[j];
                    i++;
                }
            }
        }
        else{  
            let x = 1
            console.log("CASILLAS" +  nCasillas)
            console.log("hasta: "+hasta)
            console.log("estado: "+estado)
            console.log("desde: "+desde)
                let zz = 0
                if(this.numJugadores === 4){
                    switch(this.color){
                        case "roja": 
                            x = 2
                            zz = 300
                            break;
                        case "verde":
                            x = 3
                            zz = 400
                            break;
                        case "azul":
                            x = 1
                            zz = 200
                            break;
                        case "amarilla":
                            x = 0
                            zz = 500
                            break;
                    }
                }
                else{
                    switch(this.color){
                        case "roja": 
                            x = 6
                            zz = 300
                            break;
                        case "verde":
                            x = 3
                            zz = 400
                            break;
                        case "azul":
                            x = 5
                            zz = 200
                            break;
                        case "amarilla":
                            x = 0
                            zz = 500
                            break;
                        case "naranja":
                            x = 2
                            zz = 600
                            break;
                        case "morada":
                            x = 4
                            zz = 700
                            break;
                        case "cyan":
                            x = 1
                            zz = 800
                            break;
                        case "verdeOs":
                            x = 7
                            zz = 900
                            break;
                    }
                }
                
            if(estado == "ENTRA" || (estado === "METIDA" && desde < 200)){
                x = x*17
                if(x===0) x = nCasillas


                hasta = hasta%zz
                console.log("CASILLA INICIO META" + x)
                if(x < desde){
                    for(let j=desde;j<=nCasillas;j++){
                        casillasMov[i] = casillas[j];
                        i++;
                    }
                    for(let j=1;j<=x;j++){
                        casillasMov[i] = casillas[j];
                        i++;
                    }
                }
                else{
                    for(let j=desde;j<=x;j++){
                        casillasMov[i] = casillas[j];
                        i++;
                    }
                } 
                
                if(hasta>7) hasta=7
                if(hasta==7){
                    for(let j=0;j<hasta;j++){
                        casillasMov[i] = casillasMeta[this.color][zz+j];
                        i++;
                    }
                    casillasMov[i] = casillasFin[this.color][zz+this.numero+7];
                }else{
                    for(let j=0;j<=hasta;j++){
                        casillasMov[i] = casillasMeta[this.color][zz+j];
                        console.log(zz+j)
                        i++;
                    }
                }
            }else{
                hasta = hasta%100
                desde = desde%100
                if(hasta>7) hasta=7
                if(hasta==7){
                    for(let j=desde;j<hasta;j++){
                        casillasMov[i] = casillasMeta[this.color][zz+j];
                        i++;
                    }
                    console.log("es: "+ (zz+this.numero+7))
                    casillasMov[i] = casillasFin[this.color][zz+this.numero+7];
                }else{
                    for(let j=desde;j<=hasta;j++){
                        casillasMov[i] = casillasMeta[this.color][zz+j];
                        console.log(hasta)
                        i++;
                    }
                }
            }
        }
        console.log("casillas: " + casillasMov)
        return casillasMov;
    }

    move(mx,my,velocidad){
        createjs.Tween.get(this.token)
            .to({x: mx, y: my, scaleX: 1.0, scaleY: 1.0}, velocidad);
    }

    alCarrer(mx,my,velocidad,esc){
        createjs.Tween.get(this.token)
            .to({x: mx, y: my, scaleX: esc, scaleY: esc}, velocidad);
    }

    moveAnimate(casillas,hasta, velocidad,casillasMeta,casillasFin,estado,accion){

        this.enMovimiento = true;
        this.token.cursor = "default";
        this.escalaReal=1.0;
        let casillaIni = this.casilla.numero;
        console.log("ae")
        let casillasMov = this.componerRuta(casillas,this.casilla.numero, hasta,casillasMeta,casillasFin,estado);


        console.log("casillas: " + casillasMov);
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
        function mover(casillas,i,velocidad,accion){

            console.log("i: "+i)
            console.log("length: "+casillas.length)

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
                if(i>0 && casillas[i-1].estaBarrera){
                    if(casillas[i-1].tipo==='H'){
                       
                        casillas[i-1].fichas[0].move(casillas[i-1].x-20,casillas[i-1].y,velocidad);
                        casillas[i-1].fichas[1].move(casillas[i-1].x+20,casillas[i-1].y,velocidad);
                    }
                    else if(casillas[i-1].tipo==='HH'){
                    
                        casillas[i-1].fichas[0].move(casillas[i-1].x+15,casillas[i-1].y-15,velocidad);
                        casillas[i-1].fichas[1].move(casillas[i-1].x-15,casillas[i-1].y+15,velocidad);
                    }
                    else if(casillas[i-1].tipo==='VV'){
                    
                        casillas[i-1].fichas[0].move(casillas[i-1].x-15,casillas[i-1].y-15,velocidad);
                        casillas[i-1].fichas[1].move(casillas[i-1].x+15,casillas[i-1].y+15,velocidad);
                    }

                    else if(casillas[i-1].tipo==='V'){
                    
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
                    else if(casillas[i].tipo === 'HH') {
                        num=30;
                        casillas[i].fichas[0].move(casillas[i].x - num, casillas[i].y+num, velocidad);
                        casillas[i].fichas[1].move(casillas[i].x + num, casillas[i].y-num, velocidad);

                    }
                    else if(casillas[i].tipo === 'VV') {
                        num=30;
                        casillas[i].fichas[0].move(casillas[i].x - num, casillas[i].y-num, velocidad);
                        casillas[i].fichas[1].move(casillas[i].x + num, casillas[i].y+num, velocidad);
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
                    if(casillas[i].tipo === 'HH') {
                        num=15;
                        mx += num;
                        my -= num;
                        casillas[i].fichas[0].move(casillas[i].x - num, casillas[i].y+num, velocidad);
                    }
                    if(casillas[i].tipo === 'VV') {
                        num=15;
                        mx += num;
                        my += num;
                        casillas[i].fichas[0].move(casillas[i].x - num, casillas[i].y-num, velocidad);
                    }
                    else if(casillas[i].tipo === 'V') {
                        my += num;
                        casillas[i].fichas[0].move(casillas[i].x, casillas[i].y - num, velocidad);
                    }

                }
                
                createjs.Tween.get(self.token)
                    .to({x: mx, y: my, scaleX: 1.0, scaleY: 1.0}, velocidad)
                    .call(mover,[casillas,i+1,velocidad,accion]);
            }
            else { //fin de la animacion
                let esc;            //determina el tamaño de ficha en casa
                let num = 0;
                if(self.numJugadores===4){
                    esc=2.0;
                }
                else{
                    esc=1.6;
                }
                console.log("el numeor de jugadores es " +self.numJugadores);
                self.enMovimiento = false;

                //ocupamos la nueva una vez terminada la operación,
                //para no crear anomalías con otras animaciones que pasen por allí
                //y piensen que hay una ficha cuando aún no la hay
                console.log(self.casilla)
                self.casilla = casillas[casillas.length-1]; //casillas[hasta]
                console.log(casillas.length-1)

                if(self.casilla.estaOcupada) { //comer o barrera*********************************************************
                    console.log("LLEGA: "+accion)
                    if(accion==="mata"){
                        console.log("color0: "+self.casilla.fichas[0].color)
                        console.log("self: "+this.color)

                        self.casilla.fichas[0].casilla=self.casillasCasa[self.casilla.fichas[0].color][self.casilla.fichas[0].numero];//actualizamos la casilla en la que se encuentra

                        self.casilla.fichas[0].alCarrer(self.casillasCasa[self.casilla.fichas[0].color][self.casilla.fichas[0].numero].x,
                        self.casillasCasa[self.casilla.fichas[0].color][self.casilla.fichas[0].numero].y,velocidad*3,esc);  //mover ficha comida
                        self.casilla.estaOcupada = true;
                        self.casilla.fichas[0].escalaReal = esc;//cambiar escala de ficha que mandamos a casa
                        self.casilla.fichas[0] = self;  //nos quedamos en la casilla

                        if(self.casilla.tipo === 'H') {

                            self.move(self.casilla.x, self.casilla.y, velocidad);

                        }
                        else if(self.casilla.tipo === 'HH') {
                            num=30;
                            self.move(self.casilla.x, self.casilla.y, velocidad);

                        }
                        else if(self.casilla.tipo === 'VV') {
                            num=30;
                            self.move(self.casilla.x, self.casilla.y, velocidad);
                        }
                        else if(self.casilla.tipo === 'V') {
                            self.move(self.casilla.x, self.casilla.y, velocidad);
                        }
                    }else{
                        self.casilla.estaOcupada = false;
                        self.casilla.fichas[1] = self;
                        self.casilla.estaBarrera=true;   
                    }
                }
                else if(self.casilla.estaBarrera && accion==="mata"){
                    
                    if(self.casilla.fichas[1].color === self.color){
                        self.casilla.fichas[0].casilla=self.casillasCasa[self.casilla.fichas[0].color][self.casilla.fichas[0].numero];//actualizamos la casilla en la que se encuentra
                        self.casilla.fichas[0].alCarrer(self.casillasCasa[self.casilla.fichas[0].color][self.casilla.fichas[0].numero].x,
                        self.casillasCasa[self.casilla.fichas[0].color][self.casilla.fichas[0].numero].y,velocidad*3,esc);  //mover ficha comida
                        self.casilla.fichas[0].escalaReal = esc;//cambiar escala de ficha que mandamos a casa
                        self.casilla.fichas[0] = self;  //nos quedamos en la casilla
                    }
                    else{
                        self.casilla.fichas[1].casilla=self.casillasCasa[self.casilla.fichas[1].color][self.casilla.fichas[1].numero];//actualizamos la casilla en la que se encuentra

                        self.casilla.fichas[1].alCarrer(self.casillasCasa[self.casilla.fichas[1].color][self.casilla.fichas[1].numero].x,
                        self.casillasCasa[self.casilla.fichas[1].color][self.casilla.fichas[1].numero].y,velocidad*3,esc);  //mover ficha comida
                        self.casilla.fichas[1].escalaReal = esc;//cambiar escala de ficha que mandamos a casa
                        self.casilla.fichas[1] = self;  //nos quedamos en la casilla
                    }

                }
                else{
                    self.casilla.estaOcupada = true;
                    self.casilla.fichas[0] = self;
                }

                self.socket.emit('pasarTurno', true);
            }
        }

        mover(casillasMov,0,velocidad,accion);
        console.log(casillaIni)
        if(casillaIni===0 && casillasMov[0].estaBarrera){
            console.log("se va a mover coooo")
            console.log(casillasMov[0])


            let num = 20;
            if(this.casilla.fichas[1]===this){
                if(casillasMov[0].tipo === 'H') {

                    this.move(casillasMov[0].x - num, casillasMov[0].y, velocidad);
    
                }
                else if(casillasMov[0].tipo === 'HH') {
                    num=30;
                    this.move(casillasMov[0].x + num, casillasMov[0].y-num, velocidad);

                }
                else if(casillasMov[0].tipo === 'VV') {
                    num=30;
                    this.move(casillasMov[0].x - num, casillasMov[0].y-num, velocidad);
                }
                else if(casillasMov[0].tipo === 'V') {
                    this.move(casillasMov[0].x, casillasMov[0].y - num, velocidad);
                }
            }
            else{
                if(casillasMov[0].tipo === 'H') {

                    this.move(casillasMov[0].x + num, casillasMov[0].y, velocidad);
    
                    }
                    else if(casillasMov[0].tipo === 'HH') {
                        num=30;
                        this.move(casillasMov[0].x - num, casillasMov[0].y+num, velocidad);
    
                    }
                    else if(casillasMov[0].tipo === 'VV') {
                        num=30;
                        this.move(casillasMov[0].x + num, casillasMov[0].y+num, velocidad);
                    }
                    else if(casillasMov[0].tipo === 'V') {
                        this.move(casillasMov[0].x, casillasMov[0].y + num, velocidad);
                }
            }
            
        }

    }

    triple6(num,velocidad){
        console.log("FICHA FUNCIONA "+num)
        let self=this;
        self.casilla.estaOcupada = false;
        self.casilla=self.casillasCasa[self.color][self.numero];//actualizamos la casilla en la que se encuentra
        let esc;            //determina el tamaño de ficha en casa
        if(self.numJugadores===4){
            esc=2.0;
        }
        else{
            esc=1.6;
        }

        self.alCarrer(self.casillasCasa[self.color][self.numero].x,
        self.casillasCasa[self.color][self.numero].y,velocidad*3,esc);  //mover ficha comida
        self.escalaReal=esc;//cambiar escala de ficha que mandamos a casa
        self.socket.emit('pasarTurno', true);
    }

    mostrarMovimientos(accion){
        console.log("mostrar movs")
        if(this.posiblesMovs !== []){
            let zz = 1
            switch(this.color){
                case "roja": 
                    zz = 300
                    break;
                case "verde":
                    zz = 400
                    break;
                case "azul":
                    zz = 200
                    break;
                case "amarilla":
                    zz = 500
                    break;
                case "naranja":
                    zz = 600
                    break;
                case "morada":
                    zz = 700
                    break;
                case "cyan":
                    zz = 800
                    break;
                case "verdeOs":
                    zz = 900
                    break;
            }
            for(let i=0;i<this.posiblesMovs.length;i++){
                let s = this.posiblesMovs[i][0]
                let s1 = this.posiblesMovs[i][1]
                let s2 = this.posiblesMovs[i][2]
                console.log(s+ " y "+s1 + " color: "+this.color)
                console.log("accion: "+accion +" y "+s2)
                //Falta usar el nº de ficha, no se como es ahora
                console.log("primera:"+this.casillasCampo[s].fichas[0])
                if(s1 === "FUERA"){
                    //if(this.casillasCampo[s].fichas[0]!==undefined && this.casillasCampo[s].fichas[0]!==null && this.casillasCampo[s].fichas[0].color!==this.color){
                    if(s2){
                        console.log("iluminar comer")
                        this.casillasCampo[s].iluminarComer(this);
                    }else{
                        console.log("iluminar normal")
                        console.log("PRUEBA" + s)
                        this.casillasCampo[s].iluminar(this);
                    }
                }
                else if(s1 === "METIDA") {console.log("METIDAA " + this.posiblesMovs[i]);this.casillasFin[this.color][zz+this.numero+7].iluminar(this)}
                else {
                    console.log("ZZ" + zz)
                    console.log("METAAA"+ s)
                    this.casillasMeta[this.color][zz+s-1].iluminar(this)
                }
            }
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

            if(this.posiblesMovs !== []){
                let zz = 1
                
                switch(this.color){
                    case "roja": 
                        zz = 300
                        break;
                    case "verde":
                        zz = 400
                        break;
                    case "azul":
                        zz = 200
                        break;
                    case "amarilla":
                        zz = 500
                        break;
                    case "naranja":
                        zz = 600
                        break;
                    case "morada":
                        zz = 700
                        break;
                    case "cyan":
                        zz = 800
                        break;
                    case "verdeOs":
                        zz = 900
                        break;
                }
                
                for(let i=0;i<this.posiblesMovs.length;i++){
                    let s = this.posiblesMovs[i][0]
                    let s1 = this.posiblesMovs[i][1]
                    let s2 = this.posiblesMovs[i][3]
                    console.log("valueMov"+s2)
                    if(s1 === "FUERA") this.casillasCampo[s].noIluminar();
                    else if(s1 === "METIDA") this.casillasFin[this.color][zz+this.numero+7].noIluminar()
                    else this.casillasMeta[this.color][zz+s-1].noIluminar()
                }
            }
            
        }
    }

    realizarMovimientoElegido(casilla){
        console.log("LLEGO")
        this.ocultarMovimientos(false);

        //this.moveAnimate(this.casillasCampo,casilla.numero,200);

        //comprobar vector:, puesto ahora en estatico como siempre campo (pruebas)**************
        let s = "no"
        let value = 0
        let cas = casilla.numero
        console.log("DADOS: "+this.posiblesMovs.length)
        //if(this.numDados===2){
            for(let i1=0;i1<this.posiblesMovs.length;i1++){
                console.log("valor "+this.posiblesMovs[i1]+ " ficha " +this.casilla.numero)
                if(this.posiblesMovs[i1][1]==="FUERA") {
                    if(this.posiblesMovs[i1][0]===casilla.numero) value = this.posiblesMovs[i1][3]
                }
                else if(this.posiblesMovs[i1][1]==="META"){
                    if(this.posiblesMovs[i1][0]===(casilla.numero%100+1))value = this.posiblesMovs[i1][3]
                }else{
                    let x = casilla.numero%100+1
                    if(x>8)x=8
                    if(this.posiblesMovs[i1][0]===x)value = this.posiblesMovs[i1][3]
                }
                
                console.log("value "+this.posiblesMovs[i1][3])
            }
            console.log("value "+value+" casilla "+casilla.numero)
            this.socket.emit('actValue',{valor: value})
        //}
        console.log("\n\n\n")
        
        if(casilla.meta===true) s = "meta",cas = casilla.numero%100
        console.log("es: "+s+" cas: "+cas)
        let payload = {
            color: this.color,
            n: this.numero,
            vector: "casillasCampo",
            num: casilla.numero,
            mov: value,
            accion: s
        };

        this.socket.emit('move', payload);

       // this.moveAnimate(this.casillasCampo,casilla.numero,200);
    }

}
