<template>
  <div class="content">

    <div v-if="this.$session.exists()">
    <md-dialog-prompt
      :md-active.sync="active"
      v-model="contra"
      md-title="Partida privada"
      md-input-maxlength="30"
      md-input-placeholder="Introduzca la contraseña"
      @md-confirm ="entrarPrivada()"
      md-confirm-text="OK" />

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
        <div v-if="newSala">

          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100">
              <md-field>
                <label>Nombre sala</label>
                <md-input v-model="nameSala"></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-xsmall-size-100">
              <md-field>
                <label>Tiempo entre turnos (seg)</label>
                <md-input v-model="tTurnos" type="number" min="10" max="50"></md-input>
              </md-field>
            </div>
          </div>
          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100">
              <md-field>
                <label for="nJugadores">Número de jugadores</label>
                <md-select v-model="nJugadores" name="nJugadores" id="nJugadores" md-dense>
                  <md-option value="4">4</md-option>
                  <md-option value="8" :disabled="!desbloqueado8">8</md-option>
                </md-select>
              </md-field>
            </div>
            <div class="md-layout-item md-xsmall-size-100">
              <md-field> 
                <label for="nDados">Número de dados</label>
                <md-select v-model="nDados" name="nDados" id="nDados" md-dense>
                  <md-option value="1">1</md-option>
                  <md-option value="2" :disabled="nDificultad === 'dificil' || !desbloqueaDados">2</md-option>
                </md-select>
              </md-field>
            </div>
          </div>

          <div class="md-layout">
            <div class="md-layout-item md-xsmall-size-100">
              <md-field> 
                <label for="tipoBarrera">Barreras con fichas de otros jugadores</label>
                <md-select v-model="tipoBarrera" name="tipoBarrera" id="tipoBarrera" md-dense>
                  <md-option value="si">Sí</md-option>
                  <md-option value="no">No</md-option>
                </md-select>
              </md-field>
            </div>
            <div class="md-layout-item md-xsmall-size-100">
              <md-field> 
                <label for="nDificultad">Nivel de dificultad de la IA</label>
                <md-select v-model="nDificultad" name="nDificultad" id="nDificultad" md-dense>
                  <md-option value="medio">Medio</md-option>
                  <md-option value="dificil" :disabled="nDados == 2">Difícil</md-option>
                </md-select>
              </md-field>
            </div>
          </div>
          
          <p>Opcionales co</p>
          <md-field> 
            <label>Partida privada: contraseña</label>
            <md-input v-model="passSala"></md-input>
          </md-field>
          <md-field>
              <label>Límite mínimo de puntos de ranking</label>
              <md-input v-model="Lmin" type="number"></md-input>
          </md-field>
          <md-field>
              <label>Límite máximo de puntos de ranking</label>
              <md-input v-model="Lmax" type="number"></md-input>
          </md-field>
          <p style="color:red">{{errorCrear}}</p>
          <md-button class="md-button md-block md-success" @click="enviarCrearSala">Confirmar creación</md-button>
        </div>
        <md-button class="md-button md-block md-info"><div class="md-ripple">Salas disponibles</div></md-button>
        <div v-if="listSalas.length === 0">No hay ninguna sala disponible actualmente. Puede crear usted una.</div>
        <div v-else class="md-layout">
          <div v-for="(sala, index) in listSalas" :key="index" 
            class="md-layout-item md-size-20 md-medium-size-25 md-small-size-33 md-xsmall-size-100">

            <md-card md-with-hover>
              <md-card-header>
                <div class="md-title">{{sala.nameSala}}</div>
                <div class="md-subhead">Max jugadores: {{sala.maxJugadores}}</div>
              </md-card-header>
              <md-card-content>
                <div class="md-layout">
                  <div v-for="u in sala.elegirCol" :key="u.color">
                    <md-avatar v-if="u.ocupado"><img :src="u.user.url_avatar"></md-avatar>
                  </div>
                </div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio itaque ea, nostrum odio. Dolores, sed accusantium quasi non.
              </md-card-content>
              <md-card-actions>
                <md-button @click="unirseSala(index)">Unirse</md-button>
              </md-card-actions>
            </md-card>

          </div>
        </div>
      </div>
      <div v-if="elegirColor && sala !== null">
        <p>*Nombre de sala: {{sala.nameSala}}</p>
        <div class="md-layout">
          <div v-for="e in elegirCol" :key="e.color" class="md-layout-item md-size-50 md-xsmall-size-100">
              <md-button v-if="!e.ocupado" class="md-button md-block md-raised" @click="colorElegido(e.color)" v-bind:id="'boton'+e.color">{{e.color}}</md-button>
              <md-button v-else disabled class="md-button md-block ocupado">
                <div class="md-layout md-gutter md-alignment-center">
                  <div class="md-layout-item md-xsmall-size-33">{{e.color}}</div>
                  <div class="md-layout-item md-xsmall-size-33">
                    <md-avatar class="md-large"><img :src="e.user.url_avatar" alt="Imagen de usuario"></md-avatar>
                  </div>
                  <div class="md-layout-item md-xsmall-size-33">{{e.user.name}}</div>
                </div>
              </md-button>
          </div>
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
          <md-input v-model="inputDado" @keyup.enter.native="enviarDado()"></md-input>
        </md-field>

        

        <div class="md-layout">
          <div class="md-layout-item md-size-33" id="displayColor"></div>
          <div class="md-layout-item">Turno actual: {{turnoActual}}</div>
          <div class="md-layout-item md-size-33">Tiempo turno: {{timeTurno}}</div>
        </div>

        <div class="md-layout">
          <div class="md-layout-item md-xlarge-size-15 md-large-size-20 md-medium-size-20 md-small-size-25 md-xsmall-size-100">
            <div class="md-layout">
              <div v-for="u in players.v1" :key="u.color" class="md-layout-item md-size-100 md-xsmall-size-25">
                <div v-if="u.ocupado" @click="mostrarInfo(u.user,u.color)">
                  <md-card md-with-hover>
                    <md-card-content>
                      <md-avatar class="md-large md-xsmall-medium"><img :src="u.user.url_avatar" alt="Imagen de usuario"></md-avatar>
                      <div class="md-xsmall-hide">{{u.user.name}}</div>
                      <p> COLOR : {{u.color}} </p>
                    </md-card-content>
                  </md-card>
                </div>
                <div v-else>
                  <md-card md-with-hover>
                    <md-card-content>
                      <md-avatar class="md-large"><img src="https://cnhspawprint.com/wp-content/uploads/2018/11/europeslostf.jpg" alt="Imagen de máquina"></md-avatar>
                      <p> COLOR : {{u.color}} </p>
                    </md-card-content>
                  </md-card>
                </div>
              </div>
            </div>
          </div>
          <div class="md-layout-item md-xlarge-size-70 md-large-size-60 md-medium-size-60 md-small-size-50 md-xsmall-size-100">
            <div v-if="tipoTablero === 'canvas4'">
              <canvas id="canvas" width="1000" height="1000" crossorigin="anonymous" v-bind:class="tipoTablero"></canvas>
            </div>
            <div v-else>
              <canvas id="canvas" width="1400" height="1400" crossorigin="anonymous" v-bind:class="tipoTablero"></canvas>
            </div>
          </div>
          <div class="md-layout-item md-xlarge-size-15 md-large-size-20 md-medium-size-20 md-small-size-25 md-xsmall-size-100">
            <div v-for="u in players.v2" :key="u.color">
              <div v-if="u.ocupado" @click="mostrarInfo(u.user,u.color)">
                <md-card md-with-hover>
                  <md-card-content>
                    <md-avatar class="md-large"><img :src="u.user.url_avatar" alt="Imagen de usuario"></md-avatar>
                    <div class="md-xsmall-hide">{{u.user.name}}</div>
                    <p> COLOR : {{u.color}} </p>
                  </md-card-content>
                </md-card>
              </div>
              <div v-else>
                <md-card md-with-hover>
                  <md-card-content>
                    <md-avatar class="md-large"><img src="https://cnhspawprint.com/wp-content/uploads/2018/11/europeslostf.jpg" alt="Imagen de máquina"></md-avatar>
                    <p> COLOR : {{u.color}} </p>
                  </md-card-content>
                </md-card>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="info.mostrar" class="md-layout" style="margin-top:20px">
          <md-card md-with-hover>
            <md-card-header>
              <div class="md-title">{{info.user.name}}</div>
              <div class="md-subhead">{{info.user.username}}</div>
            </md-card-header>
            <md-card-content>
              <md-avatar class="md-large"><img :src="info.user.url_avatar" alt="Imagen de usuario"></md-avatar>
              <p>{{info.user.emailadress}}</p>
              <p> COLOR : {{info.color}} Partidas: {{info.user.numPartidas}} Victorias: {{info.user.numVictorias}} Puntos: {{info.user.puntos}}</p>
            </md-card-content>
            <md-card-actions>
              <md-button>Solicitar amistad</md-button>
              <md-button @click="cerrarInfo">Cerrar info</md-button>
            </md-card-actions>
          </md-card>
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


      </div>






      <!-- Ayuda DOM preload fichas ...-->
      <div class="md-layout" style="display:none">
        <img id="roja" src="../assets/img/red8.png" />
        <img id="azul" src="../assets/img/darkblue8.png" />
        <img id="verdeOs" src="../assets/img/green8.png" />
        <img id="amarilla" src="../assets/img/yellow8.png" />
        <img id="morada" src="../assets/img/purple8.png" />
        <img id="cyan" src="../assets/img/lightblue8.png" />
        <img id="verde" src="../assets/img/lightgreen8.png" />
        <img id="naranja" src="../assets/img/orange8.png" />

        <img id="rojaClick" src="../assets/img/red8click.png" />
        <img id="azulClick" src="../assets/img/darkblue8click.png" />
        <img id="verdeOsClick" src="../assets/img/green8click.png" />
        <img id="amarillaClick" src="../assets/img/yellow8click.png" />
        <img id="moradaClick" src="../assets/img/purple8click.png" />
        <img id="cyanClick" src="../assets/img/lightblue8click.png" />
        <img id="verdeClick" src="../assets/img/lightgreen8click.png" />
        <img id="naranjaClick" src="../assets/img/orange8click.png" />

        <img id="dado1" src="../assets/img/dado1.png" />
        <img id="dado2" src="../assets/img/dado2.png" />
        <img id="dado3" src="../assets/img/dado3.png" />
        <img id="dado4" src="../assets/img/dado4.png" />
        <img id="dado5" src="../assets/img/dado5.png" />
        <img id="dado6" src="../assets/img/dado6.png" />
      </div>

      <div id="cuadroCarga" class="md-layout carga" style="display:none">
        <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>

      

      
      
    </div>

    <div v-else>
      
      INFO GUAY DE LA PAGINA CO y portadas fancy y eso yolo

    </div>

  </div> 
</template>

<script>
/* eslint-disable */
import { environment as env } from '@/environments/environment'
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
      desbloqueado8: false,
      desbloqueaDados: false,
      nameSala: '',
      nJugadores: 4,
      nDados: 1,
      tTurnos: 20,
      passSala: '',
      tipoBarrera: '',
      nDificultad: null,
      Lmin: null,
      Lmax: null,
      contra: '',
      indexSala: null,
      active: false,
      errorCrear: '',
      newSala: false,
      displaySalas: true,
      elegirColor: false,
      sala: null,
      password: false,
      creator: false,
      elegirCol: [],
      color: null,
      //ver salas
      listSalas: [],
      //tablero
      tipoTablero: 'canvas4',
      jugarTablero: false,
      dataIni: null,
      players: {
        v1: [],
        v2: []
      },
      info: {
        mostrar: false,
        color: null,
        user:{
          username: null,
          emailadress: null,
          url_avatar: null,
          numPartidas: null,
          numVictorias: null,
          puntos: null,
          name: null,
        }
      },
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
      colorDisplay: "Su color es el ",
      cont: 0,
      colorMsg: null,
      //juego interfaz
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
        console.log("COLORES RECIBIDOOO")
        console.log(data)

      },
      start_pos: function (data) {
          this.elegirColor = false
          this.jugarTablero = true
          
          if(this.sala.maxJugadores === 8) this.tipoTablero = 'canvas8'
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
            if(this.juego.porParejas) this.juego.fichas[this.juego.parejas[this.juego.userColor]].forEach(f => {f.turno=true})
          } else{
            this.juego.fichas[this.juego.userColor].forEach( f => {
              f.turno = false;
            })
            if(this.juego.porParejas) this.juego.fichas[this.juego.parejas[this.juego.userColor]].forEach(f => {f.turno=false})
          }
          
        }  
          
      },
      hayGanador: function(data) {
          alert("Patida finalizada" + data.user);
      },
      activame: function(data) {
        console.log("color: "+data.color)
        for(let i=0;i<this.sala.maxJugadores;i++){
          this.juego.fichas[data.color][i].puedeCompa = true
        }
        console.log("CHANGE: "+this.juego.fichas[data.color][0].puedeCompa)
      },
      actTime: function (data) {
        this.timeTurno = data.tiempo/1000 + 's'
      },
      posibles_movs: function (data) {
        console.log(data)
          if(this.juego !== null){
            console.log("DADO IN ")
            if(data.posibles[0].length>0 && data.posibles[0][0][0]==="triple"){
              console.log("COLOR "+color)
              let casilla = this.juego.casillasCampo[data.posibles[0][0][2]]
              let color = data.posibles[0][0][3]
              let ficha = this.juego.fichas[color][data.posibles[0][0][1]]
              console.log("COLOR "+color)
              ficha.triple6(data.posibles[0][0][2],70)
            }else{
               for(let i=0;i<4;i++){
                console.log("color: "+data.color)
                let ficha = this.juego.fichas[data.color][i]
                ficha.posiblesMovs = data.posibles[i]
                console.log("MOV: "+ficha.enMovimiento)
                console.log("SELECT: "+ficha.seleccionada)
                if((!ficha.enMovimiento && ficha.seleccionada)){
                  console.log(ficha)
                  ficha.mostrarMovimientos()
                } 
              }
            }

          }//else this.$socket.emit('pasar');
      },
      mover: function (data) {

        console.log("actualizar tablero ... "+ data)
        console.log("Acción: "+ data.accion)
        console.log(data)
        if(this.juego !== null){
          //comprobar que es el vector correcto... casillasCampo(prueba)*********************************************
 this.juego.fichas[data.color][data.n].moveAnimate(this.juego.casillasCampo,data.num,70,this.juego.casillasMeta,
 this.juego.casillasFin,data.estado,data.accion);        } 
        console.log("EMITE")
        
      
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
      if(this.inputDado) {
        this.juego.tirarDados(parseInt(this.inputDado)) //solo para probar en el frontend BORRAR(llegara desde el servidor)
        this.$socket.emit('dado',this.inputDado,this.$session.id())
      }
    },
    enviarDado2(){
      if(this.inputDado !== null) this.$socket.emit('dado',this.inputDado,this.$session.id())
    },

    crearSala(){
      this.newSala = !this.newSala
    },
    unirseSala(id){
      this.indexSala = id
      this.sala = this.listSalas[id]
      this.password = this.sala.pass
      console.log('datos sala: ')
      console.log(this.sala)
      console.log(this.password)
      if(this.password!==''){
        this.active = true  
      }
      if(this.password===''){
        this.$socket.emit('unirseSala', {id: id});
      }
    },
    entrarPrivada(){
      let id = this.indexSala
      if(this.contra === this.password){
        this.$socket.emit('unirseSala', {id: id});
      }
      else{
        this.error.title = 'Error'
        this.error.msg = 'Contraseña incorrecta'
        this.error.exist = true
      }
    },

    enviarCrearSala(){
      this.errorCrear = ''
      if(parseInt(this.tTurnos) < 5 || parseInt(this.tTurnos) > 100) 
        this.errorCrear+='El tiempo de turno debe estar entre 10 y 50 segundos. '
      if(this.nameSala === '')
        this.errorCrear+=' La sala debe tener un nombre. '
      if(parseInt(this.nJugadores) !== 4 && parseInt(this.nJugadores) !== 8)
        this.errorCrear+=' Los jugadores deben ser 4 u 8. '
      if(parseInt(this.nJugadores) === 8 && !this.desbloqueado8)
        this.errorCrear+='No tiene desbloqueada la opcion para crear partida tablero 8. '
      if(parseInt(this.nDados) !== 1 && parseInt(this.nDados) !== 2)
        this.errorCrear+=' Los dados deben ser 1 o 2. '
      if(parseInt(this.nDados) === 2 && !this.desbloqueaDados)
        this.errorCrear+='No tiene desbloqueada la opción para crear partida con 2 dados. '
      if(this.nDificultad === "dificil" && parseInt(this.nDados) === 2)
        this.errorCrear+='No puede crear una partida con IA dificil y dos dados. '
      if(!this.nDificultad)
        this.errorCrear+='Falta por rellenar el nivel de dificultad de la IA. '
      if(!this.tipoBarrera)
        this.errorCrear+='Falta por rellenar el tipo de barreras. '
      if(this.errorCrear){
        this.errorCrear = ''
        this.$socket.emit('crearSala', {
          nombre: this.nameSala, 
          tTurnos: parseInt(this.tTurnos), 
          id: this.$session.id(),
          jugadores: parseInt(this.nJugadores),
          dados: 2,
          pass: this.passSala,
          dificultad: this.nDificultad,
          tipoBarrera: this.tipoBarrera,
          Lmin: this.Lmin,
          Lmax: this.Lmax
          // No se si lo de parseInt hace falta
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
    },

    mostrarInfo(user,color){
      this.info.color = color
      this.info.user = user
      this.info.mostrar = true
    },

    cerrarInfo(){
      this.info.mostrar = false
    },

    inicio(){
      /*
      this.queue = new createjs.LoadQueue(true);
      Precarga con preloadjs no funciona por las direcciones relativas**
      */
      this.imagenes["roja"]=document.getElementById("roja")
      this.imagenes["azul"]=document.getElementById("azul")
      this.imagenes["verdeOs"]=document.getElementById("verdeOs")
      this.imagenes["amarilla"]=document.getElementById("amarilla")
      this.imagenes["morada"]=document.getElementById("morada")
      this.imagenes["cyan"]=document.getElementById("cyan")
      this.imagenes["verde"]=document.getElementById("verde")
      this.imagenes["naranja"]=document.getElementById("naranja")

      this.imagenes["rojaClick"]=document.getElementById("rojaClick")
      this.imagenes["azulClick"]=document.getElementById("azulClick")
      this.imagenes["verdeClick"]=document.getElementById("verdeClick")
      this.imagenes["amarillaClick"]=document.getElementById("amarillaClick")
      this.imagenes["moradaClick"]=document.getElementById("moradaClick")
      this.imagenes["cyanClick"]=document.getElementById("cyanClick")
      this.imagenes["verdeClick"]=document.getElementById("verdeClick")
      this.imagenes["naranjaClick"]=document.getElementById("naranjaClick")
      
      this.imagenes["dado"]=[]
      this.imagenes["dado"][1] = document.getElementById("dado1")
      this.imagenes["dado"][2] = document.getElementById("dado2")
      this.imagenes["dado"][3] = document.getElementById("dado3")
      this.imagenes["dado"][4] = document.getElementById("dado4")
      this.imagenes["dado"][5] = document.getElementById("dado5")
      this.imagenes["dado"][6] = document.getElementById("dado6")

      

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
        console.log(this.dataIni.colores)
        for(let i=0;i<this.dataIni.jugadores.length/2; i++){
          this.players.v1[i] = {
            color: this.dataIni.jugadores[i].color,
            ocupado: this.dataIni.jugadores[i].ocupado,
            user: this.dataIni.jugadores[i].user
          }
        }
        for(let i=this.dataIni.jugadores.length/2, j=0; i<this.dataIni.jugadores.length; i++,j++){
          this.players.v2[j] = {
            color: this.dataIni.jugadores[i].color,
            ocupado: this.dataIni.jugadores[i].ocupado,
            user: this.dataIni.jugadores[i].user
          }
          
        }
        console.log("LOS PLAYERRRS**************")
        console.log(this.players.v1)
        console.log(this.players.v2)
        //EL true es de juego por parejas
        this.juego = new Game("canvas", this.imagenes,this.dataIni.colores, this.dataIni.color, this.dataIni.pos, this.$socket, this.completeLoad,true,this.dados);
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

      
      let url = env.apiBaseUrl+'/usuario/info/' + this.$session.get('idusuario') + ''
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
          }else {
            this.error.title = 'Error ' + e.status
            this.error.msg = e.error
            this.error.exist = true
          }
        })
      url = env.apiBaseUrl+'/usuario/desbloqueo8/' + this.$session.get('idusuario') + ''
      this.$http.get(url)
        .then(response => {
          if (response.status === 200) {
            this.desbloqueado8 = true
          }
        })

      url = env.apiBaseUrl+'/usuario/dadosDesbloqueados/' + this.$session.get('idusuario') + ''
      this.$http.get(url)
        .then(response => {
          if (response.status === 200) {
            this.desbloqueaDados = true
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
.opcion{
  padding: 10px 20px !important;
}
.ocupado{
   
  height:100px !important;
}
#botonroja{
  background-color: #FFA0A0 !important;
  color:#E82623 !important; 
  border: 1px solid #FE5C46 !important;
  height:100px !important;
  font-weight: bold !important;
}
#botonazul{
  background-color: #7ABFFA !important;
  color:#0042CA !important; 
  border: 1px solid #2897F5 !important;
  height:100px !important;
  font-weight: bold !important;
}
#botonverde{
  background-color: #AEFFAB !important;
  color:#2AE823 !important; 
  border: 1px solid #50E53E !important;
  height:100px !important;
  font-weight: bold !important;
}
#botonamarilla{
  background-color: #F4FB89 !important;
  color:#E8E823 !important; 
  border: 1px solid #E8ED59 !important;
  height:100px !important;
  font-weight: bold !important;
}
#botoncyan{
  background-color: #91ffd6 !important;
  color:#2dbf89 !important; 
  border: 1px solid #2dbf89 !important;
  height:100px !important;
  font-weight: bold !important;
}
#botonnaranja{
  background-color: #ffb042 !important;
  color:#ff6e00 !important; 
  border: 1px solid #ff6e00 !important;
  height:100px !important;
  font-weight: bold !important;
}
#botonmorada{
  background-color: #ce58a5 !important;
  color:#870d5c !important; 
  border: 1px solid #870d5c !important;
  height:100px !important;
  font-weight: bold !important;
}
#botonverdeOs{
  background-color: #507f51 !important;
  color:#0f4410 !important; 
  border: 1px solid #0f4410 !important;
  height:100px !important;
  font-weight: bold !important;
}

.canvas4 {
  background:
          url("../assets/img/board.png")
          center/
          cover;
  width: 100%;
  height: auto;
}

.canvas8 {
  background:
          url("../assets/img/parchis8.png")
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

