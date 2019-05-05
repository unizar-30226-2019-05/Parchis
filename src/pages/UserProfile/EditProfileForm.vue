<template>
  <form>
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
            <md-field maxlength="5">
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
    <modal name="editar" :draggable="true" :resizable="true">
     <h2>
       <span>
         ¿Está seguro de que quiere modificar la información de su perfil?
       </span>
      </h2>
      <md-button class="md-round" type="submit" @click="actualizar" :data-background-color="dataBackgroundColor" >Actualizar Perfil</md-button>
    </modal>
    <modal name="perfilactualizado" :draggable="true" :resizable="true">
     <h2 class="text-success text-center">
       <span>
         Perfil actualizado correctamente
       </span>
      </h2>
    </modal>
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
      puntos: null
    }
  },
  beforeMount () {
    this.info()
  },
  methods: {
    showmodal () {
      this.$modal.show('editar')
    },
    info () {
      let url = '54.37.157.166:3306/api/usuario/info/' + this.$session.get('idusuario') + ''
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
    },
    actualizar () {
      let url = '54.37.157.166:3306/api/usuario/actualizarPerfil/' + this.$session.get('idusuario') + ''
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
            this.$modal.hide('editar')
            this.$modal.show('perfilactualizado')
            this.$router.go('/user')
          }
        })
    }

  }
}

</script>
<style>

</style>
