<template>
  <div class="content">

    <div v-if="this.$session.exists()">
      <md-dialog-prompt
      :md-active.sync="solicitarPass"
      v-model="entrarPass"
      md-title="Partida privada"
      md-input-placeholder="Introduzca la contraseña"
      @md-confirm ="entrarPrivada()"
      md-confirm-text="OK" />

      <md-dialog-alert
      :md-active.sync="error.exist"
      :md-title= "error.title"
      :md-content= "error.msg" />

      
      <md-dialog-alert
      :md-active.sync="salirSala"
      md-title= "PARTIDA FINALIZADA"
      :md-content= "salirMsg"
      md-confirm-text="ABANDONAR SALA" />


      <div v-if="displaySalas">


        <div class="md-layout">
          <div class="md-layout-item md-size-100">
            <nav-tabs-card>
              <template slot="content">
                <span class="md-nav-tabs-title">Sala:</span>
                <md-tabs :md-active-tab="step" class="md-info" md-alignment="left">

                  <md-tab id="primera" md-label="Nombre" md-icon="assignment" style="padding:20px">
                    
                    
                      <md-field>
                            <label>Nombre sala</label>
                            <md-input v-model="nameSala" @keyup.enter.native="nextTab('segunda')"></md-input>
                      </md-field>
                      <md-field>
                            <label>Descripción opcional</label>
                            <md-input v-model="descripcionSala" maxlength="150" ></md-input>
                            <md-icon>description</md-icon>
                      </md-field>
                      
                      <div class="md-layout">
                        <md-checkbox v-model="salaPrivada">Sala privada</md-checkbox>
                        <md-button class="md-info md-icon-button" @click="changePassPrivada">
                          <md-icon>lock</md-icon>
                        </md-button>

                        <md-dialog :md-active.sync="changePass">
                          <md-dialog-title>Sala privada</md-dialog-title>
                          <div class="md-layout" style="padding:20px">
                            <md-field>
                              <label>Contraseña sala</label>
                              <md-input v-model="passPrivada" type="password" @keyup.enter.native="changePass = false"></md-input>
                            </md-field>
                          </div>
                          <md-dialog-actions>
                            <md-button class="md-primary" @click="changePass = false; salaPrivada=false; passPrivada = ''">Cancelar</md-button>
                            <md-button class="md-primary" @click="changePass = false">OK</md-button>
                          </md-dialog-actions>
                        </md-dialog>
                      </div>
                      
                      <div v-if="!actTab['segunda']" class="md-layout md-alignment-top-right">
                        <md-button class="md-raised md-info" @click="nextTab('segunda')">Continuar</md-button>
                      </div>
                      
                  </md-tab>

                  <md-tab id="segunda" md-label="Propiedades" md-icon="code" :md-disabled="!actTab['segunda']" style="padding:20px">

                    
                    <div class="md-layout">
                      
                        <md-field>
                          <label>Tiempo entre turnos (seg)</label>
                          <md-input v-model="tTurnos" type="number" min="10" max="50"></md-input>
                          <md-icon>timer</md-icon>
                        </md-field>

                        <md-field>
                          <label for="nJugadores">Número de jugadores</label>
                          <md-select v-model="nJugadores" name="nJugadores" id="nJugadores" md-dense>
                            <md-option value="4">4</md-option>
                            <md-option value="8" :disabled="!desbloqueado8">8</md-option>
                          </md-select>
                          <md-icon>perm_contact_calendar</md-icon>
                        </md-field>

                        <md-field> 
                          <label for="nDados">Número de dados</label>
                          <md-select v-model="nDados" name="nDados" id="nDados" md-dense>
                            <md-option value="1">1</md-option>
                            <md-option value="2" :disabled="nDificultad === 'dificil' || !desbloqueaDados">2</md-option>
                          </md-select>
                        </md-field>

                        <md-field> 
                          <label for="tipoPartida">Tipo de partida</label>
                          <md-select v-model="tipoPart" name="tipoPartida" id="tipoPartida" md-dense>
                            <md-option value="individual">Individual</md-option>
                            <md-option value="parejas">Parejas</md-option>
                          </md-select>
                        </md-field>
                        

                        <md-dialog :md-active.sync="optAvanzadas" style="z-index: 5 !important;">
                          <md-dialog-title>Opciones avanzadas</md-dialog-title>
                          <div class="md-layout" style="padding:20px">
                            
                            <div class="md-layout">

                              <div class="md-layout-item">
                              <md-field> 
                                <label for="tipoBarrera">Barreras con fichas de otros jugadores</label>
                                <md-select v-model="tipoBarrera" name="tipoBarrera" id="tipoBarrera" md-dense>
                                  <md-option value="si">Sí</md-option>
                                  <md-option value="no">No</md-option>
                                </md-select>
                              </md-field>
                              </div>
                              <div class="md-layout-item">
                                <md-field>
                                <label>Mínimos puntos</label>
                                <md-input v-model="Lmin" type="number"></md-input>
                              </md-field>
                              </div>

                            </div>
                            <div class="md-layout">
                              <div class="md-layout-item">
                                <md-field> 
                                  <label for="nDificultad">Nivel de dificultad de la IA</label>
                                  <md-select v-model="nDificultad" name="nDificultad" id="nDificultad" md-dense>
                                    <md-option value="medio">Medio</md-option>
                                    <md-option value="dificil" :disabled="nDados == 2">Difícil</md-option>
                                  </md-select>
                                </md-field>
                              </div>
                              <div class="md-layout-item">
                                <md-field>
                                  <label>Máximos puntos</label>
                                  <md-input v-model="Lmax" type="number"></md-input>
                                </md-field>
                              </div>
                            </div>
                          </div>
                          <md-dialog-actions>
                            <md-button class="md-primary" @click="optAvanzadas = false">OK</md-button>
                          </md-dialog-actions>
                        </md-dialog>
                      
                    </div>

                    <div class="md-layout">
                      
                      <div class="md-layout-item md-layout md-alignment-top-left">
                        <md-button class="md-raised md-info" @click="optAvanzadas = true">
                          <md-icon>settings</md-icon>
                          Opciones avanzadas
                        </md-button>
                      </div>
                      <div class="md-layout-item md-layout md-alignment-top-right">
                        <md-button class="md-raised md-info" @click="createSala()">Crear</md-button>
                      </div>
                        
                    </div>
                  </md-tab>

                </md-tabs>
              </template>
            </nav-tabs-card>
          </div>
        </div>

        <div v-if="!listSalas.length">
          <div class="note" style="border-left: 4px solid #5D98DC; background-color: rgba(0,128,189,0.1);padding-top:15px; width:100%">
              <h5>No hay ninguna sala disponible actualmente. Puede crear usted una.</h5>
          </div>

        </div>
        <div v-else class="md-layout">
          <div v-for="(sala, index) in listSalas" :key="index" 
            class="md-layout-item md-size-20 md-medium-size-25 md-small-size-33 md-xsmall-size-100">

              <md-card md-with-hover>
                <md-card-header data-background-color="blue">
                  <div class="md-title">{{sala.nameSala}}</div>
                  <div class="md-subhead">Max jugadores: {{sala.maxJugadores}}</div>
                </md-card-header>
                <md-card-content>
                  <div class="md-layout">
                    <div v-for="u in sala.elegirCol" :key="u.color">
                      <md-avatar v-if="u.ocupado"><img :src="u.user.url_avatar"></md-avatar>
                    </div>
                  </div>
                  {{sala.descripcion}}
                </md-card-content>
                <md-card-actions>
                  <md-button class="md-info" @click="unirseSala(index)">Unirse</md-button>
                </md-card-actions>
              </md-card>

          </div>
        </div>
      </div>
      <div v-if="elegirColor && sala">

        <md-card>
          <md-card-header  data-background-color="blue">
            <div class="md-title">Sala: {{sala.nameSala}}</div>
          </md-card-header>

          <md-card-content>
            
            <div v-if="!sala.porParejas" class="md-layout">
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

            <div v-if="sala.porParejas">
              <div v-for="(e, index) in elegirCol" :key="e.color">
                <div v-if="index < elegirCol.length/2" class="md-layout">
                  <div class="md-layout-item md-size-20 md-xsmall-size-100">
                      <md-button class="md-button md-block b-text" v-bind:id="'boton'+e.color" 
                      v-bind:style="{ 'background-image': 'linear-gradient(to right, '+ hexColors[e.color]+' , '+hexColors[elegirCol[index+elegirCol.length/2].color]+')' }" 
                      disabled>EQUIPO {{index+1}}</md-button>
                  </div>
                  <div class="md-layout-item md-size-40 md-xsmall-size-100">
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
                  <div class="md-layout-item md-size-40 md-xsmall-size-100">
                      <md-button v-if="!elegirCol[index+elegirCol.length/2].ocupado" class="md-button md-block md-raised" 
                      @click="colorElegido(elegirCol[index+elegirCol.length/2].color)" v-bind:id="'boton'+elegirCol[index+elegirCol.length/2].color">
                      {{elegirCol[index+elegirCol.length/2].color}}</md-button>
                      <md-button v-else disabled class="md-button md-block ocupado">
                        <div class="md-layout md-gutter md-alignment-center">
                          <div class="md-layout-item md-xsmall-size-33">{{elegirCol[index+elegirCol.length/2].color}}</div>
                          <div class="md-layout-item md-xsmall-size-33">
                            <md-avatar class="md-large"><img :src="elegirCol[index+elegirCol.length/2].user.url_avatar" alt="Imagen de usuario"></md-avatar>
                          </div>
                          <div class="md-layout-item md-xsmall-size-33">{{elegirCol[index+elegirCol.length/2].user.name}}</div>
                        </div>
                      </md-button>
                  </div>
                </div>
                <md-divider v-if="index < (elegirCol.length/2) -1"></md-divider>
              </div>
              
            </div>

          </md-card-content>

          <md-card-actions class="md-layout md-alignment-top-left">
            <div class="note" style="border-left: 4px solid #5D98DC; background-color: rgba(0,128,189,0.1);padding-top:15px; width:100%">
              <p>⮚ Espere mientras se conectan más jugadores o inicie ya la partida para jugar contra la máquina en los jugadores no ocupados ...</p>
              <p>⮚ Solo el creador de la sala puede iniciar la partida</p> 
            </div>

            <md-button class="md-button md-block md-success" v-if="creator" @click="iniciarPartida">Iniciar partida</md-button>
            <md-button disabled class="ocupado" v-else>Iniciar partida</md-button>
          </md-card-actions>
        </md-card>

      </div>

      <!-- v-show porque necesitamos que el <canvas> esté cargado en el DOM cuando se acceda a su id *****-->
      <div v-show="jugarTablero">

        
        
        <md-field>
          <label>DADO1 prueba</label>
          <md-input v-model="inputDado" @keyup.enter.native="enviarDado()"></md-input>
        </md-field>

        

        <div class="md-layout">
          <div class="md-layout-item md-size-33" v-html="colorDisplay"></div>
          <div class="md-layout-item">Turno actual: <img v-if="imagenes && turnoActual" :src="imagenes[turnoActual].src" style="width:40px;height:40px"/></div>
          <div class="md-layout-item md-size-33">Tiempo turno: {{timeTurno}}</div>
        </div>

        <div class="md-layout">

          <div class="md-layout-item md-xlarge-size-15 md-large-size-20 md-medium-size-20 md-small-size-100 md-xsmall-size-100">
            <div class="md-layout">
              <div v-for="u in players.v1" :key="u.color" class="md-layout-item md-size-100 md-small-size-25 md-xsmall-size-25">
                <div v-if="u.ocupado" @click="mostrarInfo(u.user,u.color)">
                  <md-card md-with-hover>
                    <md-card-content>
                      <md-avatar class="md-large md-xsmall-medium"><img :src="u.user.url_avatar" alt="Imagen de usuario"/></md-avatar>
                      <img :src="imagenes[u.color].src" alt="Color de usuario" style="width:30px;height:30px"/>
                      <div class="md-xsmall-hide">{{u.user.name}}</div>
                      <div v-if="u.equipo" v-bind:id="'boton'+u.color1Equipo" style="height:25px !important;" class="b-text"
                      v-bind:style="{ 'background-image': 'linear-gradient(to right, '+ hexColors[u.color1Equipo]+' , '+hexColors[u.color2Equipo]+')' }">EQUIPO {{u.equipo}}</div>
                    </md-card-content>
                  </md-card>
                </div>
                <div v-else>
                  <md-card md-with-hover>
                    <md-card-content>
                      <md-avatar class="md-large"><img src="https://cnhspawprint.com/wp-content/uploads/2018/11/europeslostf.jpg" alt="Imagen de máquina"></md-avatar>
                      <img :src="imagenes[u.color].src" alt="Color de máquina" style="width:30px;height:30px"/>
                      <div class="md-xsmall-hide">IA B-games</div>
                      <div v-if="u.equipo" v-bind:id="'boton'+u.color1Equipo" style="height:25px !important;" class="b-text"
                      v-bind:style="{ 'background-image': 'linear-gradient(to right, '+ hexColors[u.color1Equipo]+' , '+hexColors[u.color2Equipo]+')' }">EQUIPO {{u.equipo}}</div>
                    </md-card-content>
                  </md-card>
                </div>
              </div>
            </div>
          </div>

          <div class="md-layout-item md-xlarge-size-70 md-large-size-60 md-medium-size-60 md-small-size-100 md-xsmall-size-100">
            <div v-if="tipoTablero === 'canvas4'">
              <canvas id="canvas" width="1000" height="1000" crossorigin="anonymous" v-bind:class="tipoTablero"></canvas>
            </div>
            <div v-else>
              <canvas id="canvas" width="1400" height="1400" crossorigin="anonymous" v-bind:class="tipoTablero"></canvas>
            </div>
          </div>

          <div class="md-layout-item md-xlarge-size-15 md-large-size-20 md-medium-size-20 md-small-size-100 md-xsmall-size-100">
            <div class="md-layout">
              <div v-for="u in players.v2" :key="u.color" class="md-layout-item md-size-100 md-small-size-25 md-xsmall-size-25">
                <div v-if="u.ocupado" @click="mostrarInfo(u.user,u.color)">
                  <md-card md-with-hover>
                    <md-card-content>
                      <md-avatar class="md-large md-xsmall-medium"><img :src="u.user.url_avatar" alt="Imagen de usuario"/></md-avatar>
                      <img :src="imagenes[u.color].src" alt="Color de usuario" style="width:30px;height:30px"/>
                      <div class="md-xsmall-hide">{{u.user.name}}</div>
                      <div v-if="u.equipo" v-bind:id="'boton'+u.color1Equipo" style="height:25px !important;" class="b-text"
                      v-bind:style="{ 'background-image': 'linear-gradient(to right, '+ hexColors[u.color1Equipo]+' , '+hexColors[u.color2Equipo]+')' }">EQUIPO {{u.equipo}}</div>
                    </md-card-content>
                  </md-card>
                </div>
                <div v-else>
                  <md-card md-with-hover>
                    <md-card-content>
                      <md-avatar class="md-large"><img src="https://cnhspawprint.com/wp-content/uploads/2018/11/europeslostf.jpg" alt="Imagen de máquina"></md-avatar>
                      <img :src="imagenes[u.color].src" alt="Color de máquina" style="width:30px;height:30px"/>
                      <div class="md-xsmall-hide">IA B-games</div>
                      <div v-if="u.equipo" v-bind:id="'boton'+u.color1Equipo" style="height:25px !important;" class="b-text"
                      v-bind:style="{ 'background-image': 'linear-gradient(to right, '+ hexColors[u.color1Equipo]+' , '+hexColors[u.color2Equipo]+')' }">EQUIPO {{u.equipo}}</div>
                    </md-card-content>
                  </md-card>
                </div>
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
            <md-button @click="toggleChat()" class="md-info md-just-icon"><md-icon >chat</md-icon></md-button>
            <span v-if="cont > 0" class="badge" style="background-color:rgba(255,0,0,0.6);border-radius:1em;padding:5px">{{cont}}</span>
            
            <div v-show="mostrarChat" class="md-layout-item chat">

              <div v-html="mensajes" class="msg-container" ref="contenedorMensajes"></div>

              <div class="md-layout">
                <md-field style="width: calc(100% - 50px)">
                  <label>Escriba un mensaje</label>
                  <md-input v-model="inputMsg" @keyup.enter.native="enviarMensaje()"></md-input>
                </md-field>
                <md-button style="width: 40px; height:40px;" @click="enviarMensaje()" 
                class="md-success md-just-icon"><md-icon>send</md-icon></md-button>
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

      

      
      
    </div>

    <div v-else>

      <h2 align="center">PARCHÍS</h2>
      <div class="note" style="border-left: 4px solid rgba(41,189,0,1)">
        <h5>Cómo jugar</h5>
      </div>
      <div class="note" style="border-left: 4px solid #88D773; background-color: rgba(41,189,0,0.1);padding-top:15px">
          <p>⮚ Para poder comenzar a jugar es necesario que accedas a tu cuenta. Si es la primera vez debes registrarte.</p>
      </div>
      <div class="note" style="border-left: 4px solid rgba(238,183,10,1)">
          <h5>Cómo resgistrarse</h5>
      </div>
      <div class="note" style="border-left: 4px solid #DCB75D; background-color: rgba(238,183,10,0.1);padding-top:15px">
          <p>⮚ Para poder comenzar a jugar puedes registrarte haciendo click <a href="/#/signin">aquí</a></p>
      </div>
      <div class="note" style="border-left: 4px solid rgba(0,128,189,1)">
        <h5>Caracteristicas del juego</h5>
      </div>
      <div class="note" style="border-left: 4px solid #91C3FE; background-color: rgba(0,128,189,0.1);padding-top:15px;margin-bottom:0px">
          <p>⮚ Puedes elegir tablero, dados y esas vainas</p>
      </div>
          
    </div>

  </div> 
</template>

<script>
/* eslint-disable */
import { environment as env } from '@/environments/environment'
import socketio from 'socket.io-client'
import {
  StatsCard,
  ChartCard,
  OrderedTable,
  NavTabsCard,
} from '@/components'

import Game from '@/assets/js/game.js'
import { mixin as clickaway } from 'vue-clickaway';

export default{
  mixins: [ clickaway ],
  components: {
    NavTabsCard,
    StatsCard
  },
  beforeMount () {
    
  },
  data () {
    return {
      //Crear sala 1.0
      step: 'primera',
      actTab: {
        'segunda': false
      },
      sha512: require('crypto-js/sha512'),

      nameSala: '',
      descripcionSala: '',
      salaPrivada: false,
      changePass: false,
      passPrivada: '',

      nJugadores: 4,
      nDados: 1,
      tTurnos: 20,
      tipoPart: 'individual',

      optAvanzadas: false,
      Lmin: null,
      Lmax: null,
      tipoBarrera: 'si',
      nDificultad: 'medio',
      
      //entrar Sala
      solicitarPass: false,
      indexSala: null,
      entrarPass: '',
      //Info usuario
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
      hexColors: {
        'amarilla': '#FFEF33','cyan': '#33FFDF','naranja': '#FFA833','verde': '#40FF33',
        'morada': '#BF33FF','azul':'#3D33FF','roja': '#FF3333','verdeOs': '#13A700'
      },
      //creacionsala
      salirSala: false,
      salirMsg: '',
      desbloqueado8: false,
      desbloqueaDados: false,

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
      timeTurno: '',
      turnoActual: '',
      imagenes: [],
      colorDisplay: ' ',
      
      colorMsg: null,
      //juego interfaz
      juego: null,
      //chat
      mostrarChat: false, cont: 0, mensajes: '',
    }
  },
  sockets: {
      connect: function () {
          console.log('socket conectado')
      },
      disconnect() {
        console.log("socket desconectado")
      },
      mensajeUnion: function(msg){
        //console.log("MENSAJE UNION A SALA RECIBIDO")
      },
      salaCreada: function (data) {
        let id=data.id
        this.sala = data.sala
        this.displaySalas = false
        this.elegirColor = true
        this.creator = true
        localStorage.setItem('idSala',id)
        localStorage.setItem('idSocket',this.$socket.id)
      },
      unido: function(id) {
        localStorage.setItem('idSala',id)
        localStorage.setItem('idSocket',this.$socket.id)
      },
      listaSalas: function (data) {
        let enCurso = []
        data.forEach( s => { if(s) enCurso.push(s)})
        this.listSalas = enCurso
        console.log("TODAS LAS SALAS RECIBIDAS*********+")
      },
      elegirColor: function (sala) {
        this.sala = sala
        this.displaySalas = false
        this.elegirCol = sala.elegirCol
        this.elegirColor = true
        console.log("COLORES RECIBIDOOO")
        console.log(sala)

      },
      start_pos: function (data) {
          this.elegirColor = false
          this.jugarTablero = true
          
          if(this.sala.maxJugadores === 8) this.tipoTablero = 'canvas8'
          
          this.dataIni = data;
          this.inicio()
      },
      turno: function (data) {
        if(this.juego !==null){
         
          this.turnoActual = data.color

          if(data.color === this.juego.userColor){

            this.juego.switchListener(true) //escuchar petición de tirada de dados

            this.juego.fichas[this.juego.userColor].forEach( f => {
              f.turno = true; f.posiblesMovs = []
            })
            if(this.juego.porParejas) this.juego.fichas[this.juego.parejas[this.juego.userColor]].forEach(f => {f.turno=true; f.posiblesMovs = []})
          } else{
            this.juego.fichas[this.juego.userColor].forEach( f => {
              f.turno = false;f.posiblesMovs = [] //reset
            })
            if(this.juego.porParejas) this.juego.fichas[this.juego.parejas[this.juego.userColor]].forEach(f => {f.turno=false;f.posiblesMovs = [] })
          }
          
        }  
          
      },
      hayGanador: function(data) {
      
        /*IMPORTANTE BORRR NADA MAS HABER UN GANADOR*/
        localStorage.removeItem('idSala')
        localStorage.removeItem('idSocket')
        /*I******************************************/

        if(data.parejas){
          this.salirMsg = "El ganador ha sido la pareja formada por " + data.ganadorUno + " y " + data.ganadorDos + ", con un premio de 25 puntos."
          this.salirSala = true
        }
        else{
          this.salirMsg = "El ganador ha sido la pareja formada por " + data.ganadorUno + ", con un premio de 25 puntos."
          this.salirSala = true
        }

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
      triple6: function (data) {
        console.log("COLOR "+data.info.color)
        console.log("FICHA "+data.info.ficha)
        console.log("POS "+data.info.pos)

        let ficha = this.juego.fichas[data.info.color][data.info.ficha]
        ficha.triple6(data.info.pos,70)
      },
      posibles_movs: function (data) {
        console.log("es " + data)
          if(this.juego !== null){
            console.log("DADO IN ")
            if(data.posibles[0].length>0 && data.posibles[0][0][0]==="triple"){
              //console.log("COLOR "+color)
              //let casilla = this.juego.casillasCampo[data.posibles[0][0][2]]
              let col = data.posibles[0][0][3]
              //let value = this.juego.fichas[col][data.posibles[0][0][1]]
              this.$socket.emit('muereTriple', {color: col,ficha: data.posibles[0][0][1],pos: data.posibles[0][0][2]});
              //console.log("COLOR "+color)
              //value.triple6(data.posibles[0][0][2],70)
            }else if(data.posibles[0].length>0 && data.posibles[0][0][0]==="actualiza"){
                this.$socket.emit('actualiza', true);
            }else{
               for(let i=0;i<4;i++){
                console.log("color: "+data.color)
                let ficha = this.juego.fichas[data.color][i]
                ficha.posiblesMovs = [] //reset
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
        if(this.juego){
          //comprobar que es el vector correcto... casillasCampo(prueba)*********************************************
          this.juego.fichas[data.color][data.n].moveAnimate(this.juego.casillasCampo,data.num,40,this.juego.casillasMeta,
          this.juego.casillasFin,data.estado,data.accion);        
        } 
        console.log("EMITE")

      
      },
      mostrarDados: function (data){
        if(this.juego) this.juego.tirarDados(data.dado1,data.dado2,data.animacion)
      },
      mensaje: function (data) {

        let [r, g, b] = data.color.match(/\w\w/g).map(x => parseInt(x, 16)); //pasar de HEX a RGBA para transparencia
        let fondo =  `rgba(${r},${g},${b},0.1)`;
        
        this.mensajes += '<div class="msg" style="border-radius:5px;border-left: 4px solid '+ 
        data.color+';background-color: '+fondo+';margin:5px 0px">'+data.timestamp+'   '+data.user+': '+data.msg+'</div>'

        if(this.mostrarChat){
          this.$nextTick(() => {
            this.$refs.contenedorMensajes.scrollTop = this.$refs.contenedorMensajes.scrollHeight //mantenerse abajo del chat
          });
        }else this.cont++ //incrementar el badge

      },
      errores: function (e) {
        this.error.title = e.titulo
        this.error.msg = e.msg
        this.error.exist = true
      },
      pedirPass: function(id) {
        this.indexSala = id
        this.solicitarPass = true
      },
      recover: function(data) {
        console.log("SALA RECUPERADA")
        let sala = data.sala
        let pos = data.pos
        if(!sala.partidaEmpezada){

          console.log("AUN NO SE HABIA INICIADO LA PARTIDA")
          this.displaySalas = false
          this.sala = sala
          this.elegirCol = sala.elegirCol
          this.elegirColor = true
          //si había elegido color, actualizarlo para ahora
          sala.coloresSession.forEach( e => {
            if(e.session === this.$session.id()){ 
              this.color = e.color
            }
          })

        }
        else{ //recargar tablero
          sala.coloresSession.forEach( e => {
						if(e.session === this.$session.id()){
              let datos={color: e.color, pos: pos, jugadores: sala.elegirCol, colores: sala.colores, 
              porParejas: sala.porParejas, nDados: sala.numDados}

              this.displaySalas = false
              this.elegirColor = false
              this.jugarTablero = true
              
              if(sala.maxJugadores === 8) this.tipoTablero = 'canvas8'

              let recargarChat = ''
              sala.historialChat.forEach( mensaje => {
                let [r, g, b] = mensaje.color.match(/\w\w/g).map(x => parseInt(x, 16)); //pasar de hex a rgba
                let fondo =  `rgba(${r},${g},${b},0.1)`;
                
                this.mensajes += '<div class="msg" style="border-radius:5px;border-left: 4px solid '+ 
                mensaje.color+';background-color: '+fondo+';margin:5px 0px">'+mensaje.timestamp+'   '+
                mensaje.user+': '+mensaje.msg+'</div>'
              
              })
              
              this.dataIni = datos;
              this.inicio()
            } 
							
					})
        }
      }
  },
  watch: {
    salaPrivada: function(b){
      this.changePass = b ? true : false
    },
    salirSala: function(b){
      if(!b) { //ha salido de la sala porque hay un ganador
        /*
        this.elegirColor = false
        this.jugarTablero = false
        this.displaySalas = true
        */
        
        location.reload()
        
      }
    }
  },
  methods: {
    nextTab(idTab){
      let e = this.contieneErrores(idTab)
      if(!e){
        this.step = idTab
        this.actTab[idTab] = true
      }else{
        this.error.title = 'Error'
        this.error.msg = e
        this.error.exist = true
      }
      
    },
    changePassPrivada(){
      if(this.salaPrivada) this.changePass = true
      else this.salaPrivada = true
    },
    contieneErrores(idTab){
      let errores = ''
      if(idTab === 'segunda' || idTab === 'crear'){ //validar primera pantalla
        if(!this.nameSala) errores += 'La sala debe tener un nombre. '
        if(this.salaPrivada && !this.passPrivada) errores+= 'Una sala privada debe tener contraseña. '
        if(this.descripcionSala && this.descripcionSala.length > 150) errores+= 'La descripción de la sala debe contener un máximo de 150 caracteres. '
      }
      if(idTab === 'crear'){//validar segunda pantalla
        if(parseInt(this.tTurnos) < 5 || parseInt(this.tTurnos) > 50) errores+='El tiempo de turno debe estar entre 10 y 50 segundos. '
        if(parseInt(this.nJugadores) !== 4 && parseInt(this.nJugadores) !== 8) errores+='Los jugadores deben ser 4 u 8. '
        if(parseInt(this.nJugadores) === 8 && !this.desbloqueado8) errores+='No tiene desbloqueada la opcion para crear partida tablero 8. '
        if(parseInt(this.nDados) !== 1 && parseInt(this.nDados) !== 2) errores+='Los dados deben ser 1 o 2. '
        if(parseInt(this.nDados) === 2 && !this.desbloqueaDados) errores+='No tiene desbloqueada la opción para crear partida con 2 dados. '
        if(this.tipoPart !== 'individual' && this.tipoPart !== 'parejas') errores+='Tipo de partida incorrecto. '
        if(this.nDificultad === "dificil" && parseInt(this.nDados) === 2) errores+='No puede crear una partida con IA dificil y dos dados. '
        if(this.nDificultad !== 'dificil' && this.nDificultad !== 'medio') errores+= 'Nivel de dificultad de la IA incorrecto. '
        if(this.tipoBarrera !== 'no' && this.tipoBarrera !== 'si') errores+='Tipo de barreras incorrecto. '
        if(this.Lmin && this.Lmin < 0) errores+='El límite de puntos mínimos no puede ser negativo. '
        if(this.Lmax && this.Lmax < 0) errores+='El límite de puntos máximos no puede ser negativo. '
        if(this.Lmin && this.Lmax && this.Lmax<this.Lmin) errores+='El límite de puntos mínimos no puede ser mayor que el máximo. '


      }
      return errores
    },
    createSala(){

      let e = this.contieneErrores('crear')
      if(e){
        this.error.title = 'Error'
        this.error.msg = e
        this.error.exist = true
      }else{
        this.$socket.emit('crearSala', {
          nombre: this.nameSala, 
          tTurnos: parseInt(this.tTurnos), 
          id: this.$session.id(),
          jugadores: parseInt(this.nJugadores),
          dados: parseInt(this.nDados),
          pass: this.passPrivada ? this.sha512(this.passPrivada).toString() : this.passPrivada,
          dificultad: this.nDificultad,

          Lmin: this.Lmin !==null ? parseInt(this.Lmin) : this.Lmin,
          Lmax: this.Lmax !==null ? parseInt(this.Lmax) : this.Lmin,
          descripcion: this.descripcionSala, 
          allowPuentes: this.tipoBarrera === 'si' ? true : false,
          porParejas: this.tipoPart === 'parejas' ? true : false
         
        })
      }

    },


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
        this.juego.tirarDados(parseInt(this.inputDado),null,true) //solo para probar en el frontend BORRAR(llegara desde el servidor)
        this.$socket.emit('dado',this.inputDado,this.$session.id())
      }
    },
    enviarDado2(){
      if(this.inputDado !== null) this.$socket.emit('dado',this.inputDado,this.$session.id())
    },
    unirseSala(id){
      this.$socket.emit('unirseSala', {id: id,sesion: this.$session.id(),nuevoSocket:false});
    },
    entrarPrivada(){
      let id = this.indexSala
      this.$socket.emit('unirseSala', {id: id,sesion: this.$session.id(),
      nuevoSocket:false,pass:this.sha512(this.entrarPass).toString()});
    },
    
    completeLoad() {
      
     console.log("tablero iniciado/fin carga")
     //poner fin de progress bar ***
      
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

    toggleChat(){
      this.mostrarChat = !this.mostrarChat
      this.cont=0;
      //mantenerse abajo del chat
      this.$nextTick(() => {
        this.$refs.contenedorMensajes.scrollTop = this.$refs.contenedorMensajes.scrollHeight 
        
      });
    },
    cerrarChat(){
      this.mostrarChat=false
    },

    inicio(){
      
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



      this.completeHandler() /* */

    },
    completeHandler(){
        console.log("MI ID DE SESION ES: "+this.$session.id())
        console.log("MI token ES: "+this.$session.id())

        let hex = this.hexColors[this.dataIni.color]
        this.colorMsg = hex
        this.colorDisplay='Su color es el '+
        '<img src="'+this.imagenes[this.dataIni.color].src+'" />'
        
        console.log("INI POSITIONS")
        console.log(this.dataIni.pos)
        console.log("COLORRR")
        console.log(this.dataIni.color)
        console.log("JUGADORESS")
        console.log(this.dataIni.jugadores)
        console.log(this.dataIni.colores)

        let orden = []; 
        orden[4] = ['roja','verde','azul','amarilla']
        orden[8] = ['morada','azul','roja','verdeOs','verde','naranja','cyan','amarilla']

        let ordenCorrecto = orden[this.dataIni.colores.length]
        let jugadores = []
        if(this.dataIni.porParejas){ //guardar equipo
          this.dataIni.jugadores.forEach( (j,i) => {
            let k = i < this.dataIni.jugadores.length/2 ? i : i-this.dataIni.jugadores.length/2
            jugadores[i]={color: j.color,ocupado: j.ocupado,user: j.user, equipo:k+1, 
            color1Equipo: this.dataIni.jugadores[k].color, color2Equipo: this.dataIni.jugadores[k+this.dataIni.jugadores.length/2].color }
          })
        } else jugadores=this.dataIni.jugadores


        let jugadoresOrdenados = []
        ordenCorrecto.forEach( (c,i) => {
          jugadores.forEach( j=> {
            if(c === j.color) jugadoresOrdenados[i]= {color: j.color,ocupado: j.ocupado,user: j.user,equipo: j.equipo, 
            color1Equipo: j.color1Equipo, color2Equipo: j.color2Equipo}
          })
        })

        for(let i=0;i<jugadoresOrdenados.length/2; i++){
          this.players.v1[i] = {
            color: jugadoresOrdenados[i].color,
            ocupado: jugadoresOrdenados[i].ocupado,
            user: jugadoresOrdenados[i].user,
            equipo: jugadoresOrdenados[i].equipo,
            color1Equipo: jugadoresOrdenados[i].color1Equipo,
            color2Equipo: jugadoresOrdenados[i].color2Equipo
          }
        }
        for(let i=jugadoresOrdenados.length/2, j=0; i<jugadoresOrdenados.length; i++,j++){
          this.players.v2[j] = {
            color: jugadoresOrdenados[i].color,
            ocupado: jugadoresOrdenados[i].ocupado,
            user: jugadoresOrdenados[i].user,
            equipo: jugadoresOrdenados[i].equipo,
            color1Equipo: jugadoresOrdenados[i].color1Equipo,
            color2Equipo: jugadoresOrdenados[i].color2Equipo
          }
          
        }
        
        //inicialización del tablero en el canvas
        this.juego = new Game("canvas", this.imagenes,this.dataIni.colores, this.dataIni.color, this.dataIni.pos, this.$socket, this.completeLoad,
          this.dataIni.porParejas,this.dataIni.nDados);
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
      

       let salaId = localStorage.getItem('idSala')
       let socketId = localStorage.getItem('idSocket')
       if(salaId){ //recuperar sala al volver a entrar en la pagina
          let nuevo = (socketId && socketId !== this.$socket.id)
          this.$socket.emit('unirseSala', {id: salaId,sesion: this.$session.id(),nuevoSocket:nuevo});
       }else{
         this.$socket.emit('buscarSalas')
       }
       
    }
  }
}
</script>

<style>
.b-text {
  text-shadow:
   -1px -1px 0 gray,  
    1px -1px 0 gray,
    -1px 1px 0 gray,
     1px 1px 0 gray;
}
.b-badge {
  width: 19px;
  height: 19px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background: red;
  border-radius: 100%;
  color: #fff;
  font-size: 10px;
  font-style: normal;
  font-weight: 600;
  letter-spacing: -.05em;
  z-index:3;
}
.chat{
  border: 1px solid #DEDEDE;
  background-color: #EDEDED;
  border-radius: 7px;
}
.msg-container{
  overflow-y:auto; 
  max-height: 200px; 
  margin: 10px 0px
}
.msg{
  margin: 1.5em 0;
  padding: 8px 16px;
  overflow: hidden;
  border-left: 4px solid #ffab40;
  background-color: #E1E1E1;
}
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
.opcion > .md-option{
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
</style>

