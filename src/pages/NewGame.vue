<template>
  <div class="content">

    <div v-if="this.$session.exists()">

      <md-dialog-alert
      :md-active.sync="error.exist"
      :md-title= "error.title"
      :md-content= "error.msg" />

      <div>
        <p v-if="isConnected">We're connected to the server!</p>
        <p>Message from server: "{{socketMessage}}"</p>
        <button @click="pingServer()">Ping Server</button>
      </div>

      <div v-if="displaySalas">
        <md-button class="md-button md-block md-info" @click="crearSala"><div class="md-ripple">Crear Sala</div></md-button>
        <div class="md-layout" v-if="newSala" id="nuevaSala">
          <md-field>
              <label>Nombre sala</label>
              <md-input v-model="nameSala"></md-input>
          </md-field>
          <md-field>
              <label>Tiempo entre turnos (seg)</label>
              <md-input v-model="tTurnos" type="number" min="5" max="100"></md-input>
          </md-field>
          <md-field>
              <label>Máximo de jugadores</label>
              <md-input v-model="nJugadores" type="number"></md-input>
          </md-field>
          <md-field>
              <label>Número de dados</label>
              <md-input v-model="nDados" type="number" min="1" max="2"></md-input>
          </md-field>
          <p style="color:red">{{errorCrear}}</p>
          <md-button class="md-button md-block md-success" @click="enviarCrearSala">Confirmar creación</md-button>
        </div>
        <md-button class="md-button md-block md-info"><div class="md-ripple">Ver salas disponibles</div></md-button>
        <div class="md-layout" id="listadoSalas" v-for="(sala, index) in listSalas" :key="index">
          <md-button class="md-button md-block md-success" @click="unirseSala(index)"><div class="md-ripple">{{sala.nameSala}}</div></md-button>
        </div>
      </div>
      <div v-if="elegirColor && sala !== null">
        <p>*Nombre de sala: {{sala.nameSala}}</p> 
        <div class="md-layout" v-for="e in elegirCol" :key="e.color">
          <md-button class="md-raised" v-if="!e.ocupado" @click="colorElegido(e.color)" v-bind:id="'boton'+e.color">{{e.color}}</md-button>
          <md-button disabled class="ocupado" v-else>{{e.color}}</md-button>
        </div>
        <p>*Espere mientras se conectan más jugadores o inicie ya la partida para jugar contra la máquina en los jugadores no ocupados ...</p>
        <p>*Solo el creador de la sala puede iniciar la partida</p> 
        <md-button class="md-button md-block md-success" v-if="creator" @click="iniciarPartida">Iniciar partida</md-button>
        <md-button disabled class="ocupado" v-else>Iniciar partida</md-button>
      </div>

      <!-- v-show porque necesitamos que el <canvas> esté cargado en el DOM cuando se acceda a su id *****-->
      <div v-show="jugarTablero">
        
        <md-field>
          <label>DADO1 prueba</label>
          <md-input v-model="inputDado" @keyup.enter.native="enviarDado"></md-input>
        </md-field>

        <div class="md-layout">
          <div class="md-layout-item md-size-33" id="displayColor"></div>
          <div class="md-layout-item">Turno actual: {{turnoActual}}</div>
          <div class="md-layout-item md-size-33">Tiempo turno: {{timeTurno}}</div>
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

            <md-button id="botonChat" class="md-button btn btn-fab md-info md-sm">
              <i class="fas fa-comments"></i>
            </md-button>
            <span id="numMsg" class="badge" style="display:none;background-color:rgba(255,0,0,0.6);border-radius:1em;padding:5px">1</span>
            
            <div id="chat" class="col-md-12" style="display:none;">
              
              <div id="mensajes" class="col-md-12" style="overflow-y:auto; max-height: 200px; margin: 10px 0px"></div>
              <div class="form-row">
                  <div class="col-10">
                    
                    <md-field>
                      <label>Escriba un mensaje</label>
                      <md-input id="msgIn" v-model="inputMsg" @keyup.enter.native="enviarMensaje"></md-input>
                    </md-field>
                      
                  </div>
                  <div class="col-2">
                      <button class="btn btn-primary" id="enviar" @click="enviarMensaje">Enviar</button>
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






      <!-- Ayuda DOM preload fichas ...-->
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

      <div id="cuadroCarga" class="md-layout carga" style="display:none">
        <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>

      

      
      
    </div>

    <div v-else>
      PRUEBAS material dashboard vue-material
      <md-button class="md-button md-block md-success"><div class="md-ripple">algooOO</div></md-button>
      <div class="alert alert-danger">ALERTAA<div class="alert-icon">ICONO</div></div>


      <button class="md-button btn btn-fab md-danger md-just-icon">
        <i class="fas fa-comments"></i>
      </button>

      <md-button class="md-button btn btn-fab md-info md-just-icon">
        <i class="fas fa-comments"></i>
      </md-button>
      <md-button class="md-button btn btn-fab md-info md-sm">
        <i class="fas fa-comments"></i>
      </md-button>
      <span class="badge" style="background-color:rgba(255,0,0,0.6);border-radius:1em;padding:5px">1</span>

      <br>
      
      <md-checkbox v-model="boolean1">Boolean</md-checkbox>

      <br>
      <br>
      <md-button class="md-primary">HOLA hhhh<div class="ripple-container"></div></md-button>
      <br>
      <br>
      
      <div class="alert" style="background-color:blue">Alerta aaaa<div class="alert-icon">ICONO</div></div>

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

import tablero4 from '../assets/img/board.png'
import tablero8 from '../assets/img/parchis8.png'

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
      nombreUsuario: 'user',
      usuario: {
        username: null,
        emailadress: null,
        url_avatar: null,
        numPartidas: null,
        numVictorias: null,
        puntos: null,
        name: null,
      },
      //creacionsala
      nameSala: '',
      nJugadores: 4,
      nDados: 1,
      tTurnos: 20,
      errorCrear: '',
      newSala: false,
      displaySalas: true,
      elegirColor: false,
      sala: null,
      creator: false,
      elegirCol: [],
      color: null,
      //ver salas
      listSalas: [],
      //tablero
      jugarTablero: false,
      //errores
      error: {
        exist: false,
        title: '',
        msg: ''
      },
      //otros
      inputMsg: null,
      inputDado: null,
      boolean1: false,
      tablero4: tablero4,
      tablero8: tablero8,
      nickname: null,
      isConnected: false,
      socketMessage: '',
      timeTurno: '',
      turnoActual: '',
      imagenes: [],
      dataIni: null,
      colorDisplay: "Su color es el ",
      cont: 0,
      colorMsg: null,
      juego: null
    }
  },
  sockets: {
      connect: function () {
          console.log('socket conectado')
          this.isConnected = true;
          /*
          if(this.$session.exists() && this.$socket){
            this.$socket.emit('iniciarPartida', this.$session.id())
          }
          */
      },
      disconnect() {
        this.isConnected = false;
      },
      mensajeUnion: function(msg){
        //console.log("MENSAJE UNION A SALA RECIBIDO")
      },
      salaCreada: function (id) {
        this.sala = this.listSalas[id]
        this.displaySalas = false
        this.elegirColor = true
        this.creator = true
      },
      listaSalas: function (data) {
        this.listSalas = data
      },
      elegirColor: function (data) {

        this.socketMessage="elija un  colooor"
        this.displaySalas = false
        this.elegirCol = data
        this.elegirColor = true
        //$("#cuadroEleccion").css("display","flex");

      },
      start_pos: function (data) {
          this.elegirColor = false
          this.jugarTablero = true
          
          $("#cuadroCarga").fadeIn();
          console.log('metodo start_pos recibio coo')
          this.socketMessage = "start_pos recibido"
          
          this.dataIni = data;
          this.inicio()
      },
      turno: function (data) {
        if(this.juego !==null){
          //this.socketMessage = "Turno del color"+data.color
          this.turnoActual = data.color

          if(data.color === this.juego.userColor){
            this.juego.fichas[this.juego.userColor].forEach( f => {
              f.turno = true;
            })
          } else{
            this.juego.fichas[this.juego.userColor].forEach( f => {
              f.turno = false;
            })
          }
          
        }  
          
      },
      actTime: function (data) {
        this.timeTurno = data.tiempo/1000 + 's'
      },
      posibles_movs: function (data) {
          if(this.juego !== null){
            

            for(let i=0;i<4;i++){
              let ficha = this.juego.fichas[data.color][i]
              ficha.posiblesMovs = data.posibles[i]
              if((!ficha.enMovimiento && ficha.seleccionada)) ficha.mostrarMovimientos()
            }
            

          }
      },
      mover: function (data) {

        console.log("actualizar tablero ...")
        if(this.juego !== null){
          //comprobar que es el vector correcto... casillasCampo(prueba)*********************************************
                this.juego.fichas[data.color][data.n].moveAnimate(this.juego.casillasCampo,data.num,200);
        } 

      },
      mensaje: function (data) {
        //se añade el mensaje al DOM

        //mensaje sin estilo 'alert'
        $("#mensajes").append("<p style=\"border-radius: 5px; padding: 10px; background-color:"+
            data.color+"\">"+data.timestamp+"   "+data.user+": "+data.msg+"</p>");
        
        //mensaje con estilo 'alert'
        /*$("#mensajes").append("<div class=\"alert\" style=\"background-color:"+
            data.color+"\">"+data.msg+"<div class=\"alert-icon\">"+data.timestamp+"   "+data.user+": </div></div>");
        */
        //si llega un mensaje y no está el chat desplegado, se muestra el icono
        if($("#chat").css("display") === "none") {
            this.cont++;
            $("#numMsg").html(this.cont);
            $("#numMsg").fadeIn();
        }
      },
      pingCliente: function (data) {
          console.log('metodo pingclienteeee recibio')
          this.socketMessage = "ping recibido"
      },
      errores: function (e) {
        this.error.title = e.titulo
        this.error.msg = e.msg
        this.error.exist = true
        console.log(this.error.title)
        console.log(this.error.msg)
      }
  },
  methods: {
    enviarMensaje(){
        let d= new Date();
        let h= d.getHours() < 10? "0"+d.getHours() : d.getHours();
        let m= d.getMinutes() < 10? "0"+d.getMinutes() : d.getMinutes();
        let payload = {
            color: this.colorMsg,
            user: this.nombreUsuario,
            timestamp: h+":"+m,
            msg: this.inputMsg
        };
        this.inputMsg = null //reseteamos el input
        this.$socket.emit('mensaje', payload);
    },

    enviarDado(){
      if(this.inputDado !== null) this.$socket.emit('dado',this.inputDado,this.$session.id())
    },

    crearSala(){
      this.newSala = !this.newSala
    },
    unirseSala(id){
      this.sala = this.listSalas[id]
      this.$socket.emit('unirseSala', {id: id});
    },

    enviarCrearSala(){
      this.errorCrear = ''
      if(this.tTurnos < 5 || this.tTurnos > 100) 
        this.errorCrear+='El tiempo de turno debe estar entre 5 y 100 segundos.'
      if(this.nameSala === '')
        this.errorCrear+='La sala debe tener un nombre.'
      if(this.nJugadores !== 4 && this.nJugadores !== 8)
        this.errorCrear+='Los jugadores deben ser 4 u 8'
      if(this.nDados !== 1 && this.nDados !== 2)
        this.errorCrear+='Los dados deben ser 1 o 2'
      if(this.errorCrear === ''){
        this.errorCrear = ''
        this.$socket.emit('crearSala', {
          nombre: this.nameSala, 
          tTurnos: this.tTurnos, 
          id: this.$session.id(),
          jugadores: this.nJugadores,
          dados: this.nDados
        })
      }
        
    },

    completeLoad() {
      // se ejecuta cuando el tablero está cargado completamente
      $("#cuadroCarga").fadeOut();
      //$("#cuadroCarga").html(""); //quitamos la carga de la animación al browser
      $("#cuadroTablero").slideToggle();
      
    },
    
    pingServer() {
      // Send the "pingServer" event to the server.
      this.$socket.emit('pingServer', 'PING!')
    },

    colorElegido(color){
      this.$socket.emit('colorElegido', {colOld: this.color, colNew: color, id: this.$session.id(), user: this.usuario})
      this.color = color
    },

    iniciarPartida(){
      this.$socket.emit('iniciarPartida', {id: this.$session.id()})
      //this.jugarTablero = true
      //this.elegirColor = false
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
      
      //muestra u oculta el chat en la interfaz del usuario
      $("#botonChat").on("click",() =>{
      
          $("#chat").slideToggle();
          //Se oculta el icono de notificación en caso de que estuviera mostrado
          $("#numMsg").fadeOut();
          this.cont=0;

      });


      this.completeHandler() /* */

    },
    completeHandler(){
        console.log("MI ID DE SESION ES: "+this.$session.id())
        console.log("MI token ES: "+this.$session.id())

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
        console.log("INI POSITIONS")
        console.log(this.dataIni.pos)
        console.log("COLORRR")
        console.log(this.dataIni.color)
        console.log("JUGADORESS")
        console.log(this.dataIni.jugadores)
        this.juego = new Game("canvas", this.imagenes, this.dataIni.color, this.dataIni.pos, this.$socket, this.completeLoad);
        
        
    }
  },
  mounted(){
    if(this.$session.exists() && this.$socket){
       //this.$socket.emit('iniciarPartida', {col: null, id: this.$session.id()})

       console.log("MI SESION")
       console.log(this.$session.id())
       console.log("MI ID")
       console.log(this.$session.get('idusuario'))
       this.nombreUsuario = this.$session.get('idusuario')

      
      let url = 'http://localhost:3000/api/usuario/info/' + this.$session.get('idusuario') + ''
      this.$http.post(url)
        .then(response => {
          if (response.status === 200) {
            this.usuario.username = response.data['nombreCompleto']
            this.usuario.emailadress = response.data['correo']
            this.usuario.url_avatar= response.data['url_avatar']
            this.usuario.numPartidas= response.data['numPartidas']
            this.usuario.numVictorias= response.data['numVictorias']
            this.usuario.puntos= response.data['puntos']
            this.usuario.name = this.nombreUsuario
          }
        })

        



       this.$socket.emit('buscarSalas')
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

.carga{
  width: 80px;
  height: 80px;
  /*background-color: red;*/

  position:absolute; /*tambien puede ser fixed*/
  left:0; right:0;
  top:0; bottom:0;
  margin:auto;

}

.ocupado{
  width:49% !important; 
  height:auto !important;
  margin: 1px 1px 2px!important;
}
#botonroja{
  background-color: #FFA0A0 !important;
  color:#E82623 !important; 
  border: 1px solid #FE5C46 !important; 
  width:49% !important; 
  height:100px !important;
  margin: 1px 1px 2px!important;
  font-weight: bold !important;
}
#botonazul{
  background-color: #7ABFFA !important;
  color:#0042CA !important; 
  border: 1px solid #2897F5 !important; 
  width:49% !important; 
  height:100px !important;
  margin: 1px 1px 2px!important;
  font-weight: bold !important;
}
#botonverde{
  background-color: #AEFFAB !important;
  color:#2AE823 !important; 
  border: 1px solid #50E53E !important; 
  width:49% !important; 
  height:100px !important;
  margin: 1px 1px 2px!important;
  font-weight: bold !important;
}
#botonamarilla{
  background-color: #F4FB89 !important;
  color:#E8E823 !important; 
  border: 1px solid #E8ED59 !important; 
  width:49% !important; 
  height:100px !important;
  margin: 1px 1px 2px !important;
  font-weight: bold !important;
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

