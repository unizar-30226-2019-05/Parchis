<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <edit-profile-form data-background-color="blue">

        </edit-profile-form>
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-33">
        <user-card>
        </user-card>
      </div>
      <md-card>
      <md-card-header data-background-color="blue">
            <h4 class="title">Mis amigos</h4>
          </md-card-header>
          <md-card-content>
            <template>
              <div>
                <md-button class="md-raised" data-background-color="blue" v-bind:class="{ 'md-danger': clicked1 , 'md-success': !clicked1 }" type="submit" @click="amigos(0)" >
                  Solicitudes
                </md-button>
                <md-button class="md-raised" data-background-color="blue" v-bind:class="{ 'md-danger': clicked2 , 'md-success': !clicked2 }" type="submit" @click="amigos(1)" >
                  Amigos
                </md-button>
                <md-button class="md-raised" data-background-color="blue" v-bind:class="{ 'md-danger': clicked3 , 'md-success': !clicked3 }" type="submit" @click="amigos(2)" >
                  <md-icon>search</md-icon>
                  Buscar usuarios
                </md-button>
                <br>
                 <md-button  v-if="clicked1" class="md-raised md-success" @click="showmodal('aceptarpendiente',0)">
                    <i class="material-icons"> done_outline</i> Aceptar {{count}} solicitudes
                 </md-button>
                 <md-button  v-if="clicked1" class="md-raised md-success" @click="showmodal('aceptarpendiente',1)">
                    <i class="material-icons"> done_outline</i> Aceptar todas las solicitudes
                 </md-button>
                 <h3>{{tipolistado}}</h3>
                 <md-table>
                  <md-table-row slot="md-table-row" v-for="usuario of listausuarios" :key="usuario.id">
                      <md-table-cell>
                        <div class="custom-control custom-checkbox">
                          <input type="checkbox" class="custom-control-input" v-if="clicked1" v-bind:value="usuario.nombreUsuario" v-model="checkedUsuarios">
                        </div>  
                      </md-table-cell>
                      <md-table-cell md-label="Nombre"><router-link class="routerlink" :to="{path:`/perfil?perfil=${usuario.nombreUsuario}`}">
                        <i v-if="clicked2" class="material-icons"> games</i> 
                        <br>
                        {{ usuario.nombreUsuario }}
                        <br>
                      </router-link>
                      </md-table-cell>
                      <md-table-cell v-if="clicked2">
                        <div class="md-layout">
                          <div class="md-layout-item md-size-15">
                            <img class="img-fluid" :src="usuario.url_avatar">
                          </div>
                        </div>
                      </md-table-cell>
                      <md-table-cell v-if="clicked2">
                        Puntos: {{usuario.puntos}}
                        <br>
                      </md-table-cell>
                      
                  </md-table-row>
                </md-table>
              </div>
            </template>
          </md-card-content>
        </md-card>
    </div>
    <modal name="aceptarpendiente" :draggable="true" :resizable="true">
     <h2  v-if="tipoborrado==0" class="text-success text-center">¿Está seguro de aceptar su elección?</h2>
     <h2  v-if="tipoborrado==1" class="text-success text-center">¿Está seguro de aceptar todos los usuarios?</h2>
     <p style="line-height: 70px; text-align: center;"><md-button class="md-raised md-success" type="submit" @click="aceptarUsuario">Aceptar</md-button></p>
    </modal>
  </div>
</template>

<script>

import {
  EditProfileForm,
  UserCard
} from '@/pages'

export default{
  components: {
    EditProfileForm,
    UserCard
  },
  data () {
    return {
      listranking: [],
      listafiltrada: [],
      tipolistado: 'Solicitudes pendientes',
      clicked1: true,
      clicked2: false,
      clicked3: false,
      tipo: 0,
      search: '',
      checkedUsuarios: [],
      count: 0,
      listausuarios: [],
      tipoborrado: 0
    }
  },
  watch: {
    checkedUsuarios: function (val) {
      this.count = this.checkedUsuarios.length
    }
  },
  beforeCreate: function () {
    if (!this.$session.exists()) {
      this.$router.push('/')
    }
  },
  methods: {
    showmodal (tipo, id) {
      this.tipoborrado = id
      this.$modal.show(tipo)
    },
    amigos (tipo) {
      // tipo 0 = pendientes , tipo 1 = aceptados
      if (tipo === 0) {
        this.tipolistado = 'Solicitudes pendientes'
        this.clicked1 = true
        this.clicked2 = false
        this.clicked3 = false
        this.tipo = tipo
      } else if (tipo === 1) {
        this.tipolistado = 'Amigos agregados'
        this.clicked1 = false
        this.clicked2 = true
        this.clicked3 = false
        this.tipo = tipo
      } else if (tipo === 2) {
        this.tipolistado = 'Buscar usuarios'
        this.clicked1 = false
        this.clicked2 = false
        this.clicked3 = true
        this.tipo = 2
      }
      this.checkedUsuarios = []
      if (tipo === 1){
        let url = 'http://localhost:3000/api/usuario/listusuarios/' + this.$session.get('idusuario') +'/'+ this.tipo
        this.$http.get(url)
          .then(response => {
            console.log('responde')
            if (response.status === 200) {
              let datos = response.data
              console.log(response.data)
              for (var i = 0; i < datos.length; i++) {
              this.listausuarios.push({ nombre: datos[i].nombreUsuario, puntos:datos[i].puntos, url_avatar: datos[i].url_avatar })
            }
              this.listausuarios = response.data
            } else if (response.status === 201) {
              this.listausuarios = null
            }
          })
      }
      else if (tipo === 0){
        let url = 'http://localhost:3000/api/usuario/listsolicitud/' + this.$session.get('idusuario') +'/'+ this.tipo
        this.$http.get(url)
          .then(response => {
            console.log('responde')
            if (response.status === 200) {
              this.listausuarios = response.data
            } else if (response.status === 201) {
              this.listausuarios = null
            }
          })
      } else if (tipo === 2) {
        let url = 'http://localhost:3000/api/usuario/listatotal/'
        this.$http.get(url)
          .then(response => {
            console.log('HAY RESPUESTA')
            if (response.status === 200) {
              this.listausuarios = response.data
            } else if (response.status === 201) {
              this.listausuarios = null
            }
          })
      }
    },
    async aceptarUsuario() {
      try {
        if (this.tipoborrado === 0) {
          if (this.checkedUsuarios.length > 0) {
            for (var i = 0; i < this.checkedUsuarios.length; i++) {
              let url = 'http://localhost:3000/api/usuario/aceptarUsuario/' + this.checkedUsuarios[i] +'/'+ this.$session.get('idusuario')
              let response = await this.$http.post(url)
              if (response.status === 200) {
                this.$modal.hide('aceptarpendiente')
                this.amigos(0)
              }
            }
          }
        } else {
          if (this.listausuarios.length > 0) {
            for (var j = 0; j < this.listausuarios.length; j++) {
              let url = 'http://localhost:3000/api/usuario/aceptarUsuario/' + this.listausuarios[j].nombreUsuario
              let response = await this.$http.post(url)
              if (response.status === 200) {
                this.$modal.hide('aceptarpendiente')
                this.amigos(1)
              }
            }
          }
        }
      } catch (err) {}
    }
  }
}
</script>