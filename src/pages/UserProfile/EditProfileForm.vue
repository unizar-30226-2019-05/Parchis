<template>
  <form>
    <md-dialog-confirm
      :md-active.sync="confirmacion.exist"
      :md-title= "confirmacion.title"
      :md-content= "confirmacion.msg"
      @md-confirm="actualizar" />
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title" >Editar Perfil </h4>
        <p class="category">Completa los datos de tu perfil</p>
      </md-card-header>
      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Nombre</label>
              <md-input v-model="username" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Email</label>
              <md-input v-model="emailadress" type="email"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field maxlength="5" v-if="editarAvatar">
              <label>URL de la imagen de mi nuevo a avatar </label>
              <md-textarea v-model="url_avatar"></md-textarea>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100 text-left">
            <md-button class="md-raised"  type="submit" :data-background-color="dataBackgroundColor" @click="showmodal" >Actualizar perfil</md-button>
          </div>
        </div>

      </md-card-content>
    </md-card>
  </form>
</template>
<script>
export default {
  name: 'edit-profile-form',
  props: {
    dataBackgroundColor: {
      type: String,
      default: 'blue'
    }
  },
  data () {
    return {
      username: null,
      emailadress: null,
      url_avatar: null,
      numVictorias: null,
      numPartidas: null,
      puntos: null,
      confirmacion: {
        exist: false,
        title: '',
        msg: ''
      },
      editarAvatar: false
    }
  },
  beforeMount () {
    this.info()
  },
  methods: {
    showmodal () {
      this.confirmacion.title = 'Confirmación'
      this.confirmacion.msg = '¿Está seguro de que quiere actualizar su perfil?'
      this.confirmacion.exist = true
    },
    info () {
      let url = 'http://localhost:3000/api/usuario/info/' + this.$session.get('idusuario') + ''
      this.$http.post(url)
        .then(response => {
          if (response.status === 200) {
            this.username = response.data['nombreCompleto']
            this.emailadress = response.data['correo']
            this.url_avatar= response.data['url_avatar']
            this.numPartidas= response.data['numPartidas']
            this.numVictorias= response.data['numVictorias']
            this.puntos= response.data['puntos']
          }
        })
      
      url = 'http://localhost:3000/api/usuario/avatar/' + this.$session.get('idusuario') + ''
      this.$http.get(url)
        .then(response => {
          if (response.status === 200) {
            this.editarAvatar = true
          }
        })
    },
    actualizar () {
      let url = 'http://localhost:3000/api/usuario/actualizarPerfil/' + this.$session.get('idusuario') + ''
      this.$http.post(url, {
        name: this.username,
        emailadress: this.emailadress,
        url: this.url_avatar
      })
        .then(response => {
          if (response.status === 200) {
            this.username = response.data['name']
            this.emailadress = response.data['correo']
            this.url_avatar=response.data['url_avatar']
            this.$router.go('/user')
            
          }
        })
        
    }

  }
}

</script>
<style>

</style>
