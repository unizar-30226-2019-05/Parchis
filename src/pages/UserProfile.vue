<template>
  <div class="content">
    <md-dialog-alert
      :md-active.sync="errores.exist"
      :md-title= "errores.title"
      :md-content= "errores.msg" />
    <md-dialog-confirm
      :md-active.sync="confirmacion.exist"
      :md-title= "confirmacion.title"
      :md-content= "confirmacion.msg"
      @md-confirm="aceptarUsuario" />
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
                 <md-button  v-if="clicked1" class="md-raised md-success" @click="showmodal(0)">
                    <i class="material-icons"> done_outline</i> Aceptar {{count}} solicitudes
                 </md-button>
                 <md-button  v-if="clicked1" class="md-raised md-success" @click="showmodal(1)">
                    <i class="material-icons"> done_outline</i> Aceptar todas las solicitudes
                 </md-button>
                 <h3>{{tipolistado}}</h3>
                 <form>
                  <md-field>
                  <label> <i class="material-icons">search</i> Nombre del usuario</label>
                  <md-input v-model="search" type="text" ></md-input>
                </md-field>
                </form> 
                 <md-table>
                  <md-table-row slot="md-table-row" v-for="usuario of listafiltrada" :key="usuario.id">
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
      tipoborrado: 0,
      confirmacion: {
        exist: false,
        title: '',
        msg: ''
      },
      errores: {
        exist: false,
        title: '',
        msg: ''
      }
    }
  },
  watch: {
    search: function (val) {
      if (this.listausuarios != null) {
        this.listafiltrada = this.listausuarios.filter(function (usuario) {
          return usuario['nombreUsuario'].toLowerCase().includes(val.toLowerCase())
        })
      }
    },

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
    showmodal (id) {
      if(id === 0){
        this.confirmacion.title = 'Confirmación'
        this.confirmacion.msg = '¿Está seguro de aceptar las solicitudes seleccionadas?'
        this.confirmacion.exist = true
        this.tipoborrado = 0
      }
      else {
        this.confirmacion.title = 'Confirmación'
        this.confirmacion.msg = '¿Está seguro de aceptar TODAS las solicitudes?'
        this.confirmacion.exist = true
        this.tipoborrado = 1
      }
      
    },
    amigos (tipo) {
      // tipo 0 = pendientes , tipo 1 = aceptados, tipo 2 = lista total de usuarios
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
              this.listausuarios = response.data
              this.listafiltrada = response.data
            } else if (response.status === 201) {
              this.listausuarios = null
              this.listafiltrada = null
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
              this.listafiltrada = response.data
            } else if (response.status === 201) {
              this.listausuarios = null
              this.listafiltrada = null
            }
          })
      } else if (tipo === 2) {
        let url = 'http://localhost:3000/api/usuario/listatotal/' + this.$session.get('idusuario')
        this.$http.get(url)
          .then(response => {
            console.log('HAY RESPUESTA')
            if (response.status === 200) {
              this.listausuarios = response.data
              this.listafiltrada = response.data
            } else if (response.status === 201) {
              this.listausuarios = null
              this.listafiltrada = null
            }
          })
      }
    },
    async aceptarUsuario() {
      try {
        console.log('tipoborrado =')
        console.log(this.tipoborrado)
        if (this.tipoborrado === 0) {
          if (this.checkedUsuarios.length > 0) {
            for (var i = 0; i < this.checkedUsuarios.length; i++) {
              let url = 'http://localhost:3000/api/usuario/aceptarUsuario/' + this.checkedUsuarios[i] +'/'+ this.$session.get('idusuario')
              let response = await this.$http.post(url)
              if (response.status === 200) {
                
              }
            }
            this.errores.title = 'Exito'
                this.errores.msg = 'Su selección ha sido aceptada correctamente.'
                this.errores.exist = true
                this.amigos(0)
          }
        } else {
          console.log('Entra aceptar todos')
          console.log(this.listausuarios)
          if (this.listausuarios.length > 0) {
            for (var j = 0; j < this.listausuarios.length; j++) {
              let url = 'http://localhost:3000/api/usuario/aceptarUsuario/' + this.listausuarios[j].nombreUsuario +'/'+ this.$session.get('idusuario')
              let response = await this.$http.post(url)
              if (response.status === 200) {
                
              }
            }
            this.errores.title = 'Exito'
                this.errores.msg = 'Todas las solicitudes han sido aceptadas correctamente.'
                this.errores.exist = true
                this.amigos(0)
          }
        }
      } catch (err) {}
    }
  }
}
</script>