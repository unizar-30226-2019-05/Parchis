<template>
  <div class="content">

    <div v-if="this.$session.exists()">

      <div>
        <p v-if="isConnected">We're connected to the server!</p>
        <p>Message from server: "{{socketMessage}}"</p>
        <button @click="pingServer()">Ping Server</button>
      </div>

      <div class="md-layout" style="display:none">
        <img id="roja" src="../assets/img/red.png" />
        <img id="azul" src="../assets/img/blue.png" />
        <img id="verde" src="../assets/img/green.png" />
        <img id="amarilla" src="../assets/img/yellow.png" />

        <img id="rojaClick" src="../assets/img/redclick.png" />
        <img id="azulClick" src="../assets/img/blueclick.png" />
        <img id="verdeClick" src="../assets/img/greenclick.png" />
        <img id="amarillaClick" src="../assets/img/yellowclick.png" />
      </div>

      <div id="cuadroCarga" class="md-layout" style="height:100%;width:100%;margin:auto">
        <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>

      <div id="cuadroTablero" style="display:none">
        

        <div class="md-layout">
          <div class="md-layout-item md-size-33" id="displayColor"></div>
          <div class="md-layout-item">Turno actual:</div>
          <div class="md-layout-item md-size-33">Tiempo turno:</div>
        </div>

        <div class="md-layout">
          <div class="md-layout-item md-size-15">
            [img Usuario X]
            UsuarioX...
          </div>
          <div class="md-layout-item">
            
              <canvas id="canvas" width="1000" height="1000"></canvas>

          </div>
          <div class="md-layout-item md-size-15">
            [img Usuario X]
            UsuarioX...
          </div>
        </div>
        

        <div class="md-layout">
          <div class="md-layout-item">
            
            <button id="botonChat" class="col-md-12 btn btn-primary btn-block">
              <span class="d-inline">Chat </span>
              <span id="iconoChat" style="display:none">
                <i class="fas fa-exclamation-circle" style="color:red"></i>
                <span class="badge badge-light" id="numMsg"></span>
              </span>
            </button>
            <div id="chat" class="col-md-12" style="display:none;">
              
                <div id="mensajes" class="col-md-12" style="overflow-y:auto; max-height: 200px; margin: 10px 0px"></div>
              
              
              <div class="form-row">
                  <div class="col-10">
                          <input id="msgIn" type="input" class="form-control" placeholder="Escriba un mensaje" />
                  </div>
                  <div class="col-2">
                          <button class="btn btn-primary" id="enviar">Enviar</button>
                  </div>

              </div>      
                
            </div>

          </div>
        </div>

        <div class="md-layout">
          <div class="md-layout-item">
            
            <p>item 1: Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
              when an unknown printer took a galley of type and scrambled it to make a type specimen book.
              It has survived not only five centuries, but also the leap into electronic typesetting,
              remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
              sheets containing Lorem Ipsum passages, and more recently with desktop publishing software
              like Aldus PageMaker including versions of Lorem Ipsum.</p>
          </div>
          <div class="md-layout-item">
            <p>item 2: Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
              when an unknown printer took a galley of type and scrambled it to make a type specimen book.
              It has survived not only five centuries, but also the leap into electronic typesetting,
              remaining essentially unchanged. It was popularised in</p>

          </div>
        </div>


      </div>
      
    </div>

    <div v-else>
      NADA TIOOOO
    </div>

  </div> 
</template>

<script>
import {
  StatsCard,
  ChartCard,
  NavTabsCard,
  OrderedTable,
  parchis
} from '@/components'

import roja from '../assets/img/red.png'

//import { Game, Casilla, Ficha } from '../assets/js'
import Game from '../assets/js/game.js'

export default{
  components: {
    StatsCard,
    ChartCard,
    NavTabsCard,
    OrderedTable
  },
  beforeMount () {
    
  },
  data () {
    return {
      roja: roja,
      nickname: null,
      isConnected: false,
      socketMessage: '',
      imagenes: [],
      dataIni: null,
      colorDisplay: "Su color es el ",
      cont: 0,
      colorMsg: null,
      juego: null,
    }
  },
  sockets: {
      connect: function () {
          console.log('socket conectado')
          this.isConnected = true;
      },
      disconnect() {
        this.isConnected = false;
      },
      start_pos: function (data) {
          console.log('metodo start_pos recibio coo')
          this.socketMessage = "aibaa la ostia patxiii"
          console.log(data.pos)
          this.dataIni = data;
          if(this.$session.exists()) this.inicio()
      },
      mover: function (data) {
        console.log("tocaria actualizar tablero ...")
        if(this.juego !== null){
          //comprobar que es el vector correcto... casillasCampo(prueba)*********************************************
             if(!this.juego.fichas[data.color][data.n].enMovimiento) //evitar la repeticion del movimiento para la ficha que lo ha enviado?
                this.juego.fichas[data.color][data.n].moveAnimate(this.juego.casillasCampo,data.num,200);
        }
      },
      mensaje: function (data) {
        //se añade el mensaje al DOM
        $("#mensajes").append("<p style=\"border-radius: 5px; padding: 10px; background-color:"+
            data.color+"\">"+data.timestamp+"   "+data.user+": "+data.msg+"</p>");

        //si llega un mensaje y no está el chat desplegado, se muestra el icono
        if($("#chat").css("display") === "none") {
            this.cont++;
            $("#numMsg").html(this.cont);
            $("#iconoChat").fadeIn();
        }
      },
      pingCliente: function (data) {
          console.log('metodo pingclienteeee recibio')
          this.socketMessage = "acoñooooo"
      }
  },
  methods: {
    enviarMensaje(){
        let d= new Date();
        let h= d.getHours() < 10? "0"+d.getHours() : d.getHours();
        let m= d.getMinutes() < 10? "0"+d.getMinutes() : d.getMinutes();
        let payload = {
            color: this.colorMsg,
            user: "usuarioX", //*********************************
            timestamp: h+":"+m,
            msg: $("#msgIn").val()
        };
        $("#msgIn").val(""); //reseteamos el input
        this.$socket.emit('mensaje', payload);
    },

    completeLoad() {
      // se ejecuta cuando el tablero está cargado completamente
      $("#cuadroCarga").fadeOut();
      //$("#cuadroCarga").html(""); //quitamos la carga de la animación al browser
      $("#cuadroTablero").fadeIn();
      
    },
    
    pingServer() {
      // Send the "pingServer" event to the server.
      this.$socket.emit('pingServer', 'PING!')
    },

    inicio(){
      /*
      this.queue = new createjs.LoadQueue(true);
      Precarga con preloadjs no funciona por las direcciones relativas**
      */
      this.imagenes["roja"]=document.getElementById("roja")
      this.imagenes["azul"]=document.getElementById("azul")
      this.imagenes["verde"]=document.getElementById("verde")
      this.imagenes["amarilla"]=document.getElementById("amarilla")

      this.imagenes["rojaClick"]=document.getElementById("rojaClick")
      this.imagenes["azulClick"]=document.getElementById("azulClick")
      this.imagenes["verdeClick"]=document.getElementById("verdeClick")
      this.imagenes["amarillaClick"]=document.getElementById("amarillaClick")

      //listeners Jquery **importante no mezclarlos con los de Vue**
      //enviar mensaje pulsando enviar
      $("#enviar").on("click",()=>{
          this.enviarMensaje();
      });
      //enviar mensaje pulsando <ENTER>
      $("#msgIn").on("keypress", e =>{
          let keycode = (e.keyCode ? e.keyCode : e.which);
          if(keycode == '13'){
              this.enviarMensaje();
          }
      });
      //muestra u oculta el chat en la interfaz del usuario
      $("#botonChat").on("click",() =>{
      
          $("#chat").slideToggle();
          //Se oculta el icono de notificación en caso de que estuviera mostrado
          $("#iconoChat").fadeOut();
          this.cont=0;

      });


      this.completeHandler() /* */

    },
    completeHandler(){

        switch(this.dataIni.color){
          case "roja":
              this.colorMsg="rgba(255,0,0,0.3)";
              this.colorDisplay+="<span class=\"d-inline\" style=\"color:red\" >rojo</span>";
              break;
          case "amarilla":
              this.colorMsg="rgba(255,255,0,0.3)";
              this.colorDisplay+="<span class=\"d-inline\" style=\"color:yellow\" >amarillo</span>";
              break;
          case "verde": 
              this.colorMsg="rgba(0,255,0,0.3)";
              this.colorDisplay+="<span class=\"d-inline\" style=\"color:green\" >verde</span>";
              break;
          case "azul":
              this.colorMsg="rgba(0,0,255,0.3)";
              this.colorDisplay+="<span class=\"d-inline\" style=\"color:blue\" >azul</span>";
              break;
          default:
              this.colorMsg="black";
              break;
        }
        
        $("#displayColor").html(this.colorDisplay);

        this.juego = new Game("canvas", this.imagenes, this.dataIni.color, this.dataIni.pos, this.$socket, this.completeLoad);
        
        
    }
  }
}
</script>
<style>

.fotopequeña{
  z-index: 1 !important;
  width: 200px !important;
  height: 200px !important;
  max-width: 700px !important;
  max-height: 700px !important;
}
.carousel{
  width: 100% !important;
}

#canvas {
  background:
          url("../assets/img/board.png")
          center/
          cover;
  width: 100%;
  height: auto;
}

/*****CSS PURE LOADER****/
.lds-roller {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 32px 32px;
}
.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: red;
  margin: -3px 0 0 -3px;
}
.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
}
.lds-roller div:nth-child(1):after {
  background: #CAE8FF;
  top: 50px;
  left: 50px;
}
.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
}
.lds-roller div:nth-child(2):after {
  background: #B5DEFF;
  top: 54px;
  left: 45px;
}
.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
}
.lds-roller div:nth-child(3):after {
  background: #A3D6FF;
  top: 57px;
  left: 39px;
}
.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
}
.lds-roller div:nth-child(4):after {
  background: #8FCDFF;
  top: 58px;
  left: 32px;
}
.lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
}
.lds-roller div:nth-child(5):after {
  background: #7BC4FF;
  top: 57px;
  left: 25px;
}
.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
}
.lds-roller div:nth-child(6):after {
  background: #70BFFF;
  top: 54px;
  left: 19px;
}
.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
}
.lds-roller div:nth-child(7):after {
  background: #67BBFF;
  top: 50px;
  left: 14px;
}
.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
}
.lds-roller div:nth-child(8):after {
  background: #4FB0FF;
  top: 45px;
  left: 10px;
}
@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

