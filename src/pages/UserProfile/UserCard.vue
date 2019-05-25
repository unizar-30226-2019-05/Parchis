<template>
  <div>

    <md-dialog-confirm
      :md-active.sync="confirmarEliminar"
      md-title="Eliminar cuenta"
      md-content= "¿Está seguro de que desea eliminar su cuenta? Una vez borrada no podrá ser recuperada."
      @md-confirm ="dardebaja()"
      md-confirm-text="Confirmar" />
    
    <md-card class="md-card-profile">
      <div class="md-card-avatar">
        <img class="img" :src="url_avatar">
      </div>

      <md-card-content>
        <h6 class="category text-gray">{{username}}</h6>
        <h5 class="card-title"> {{emailadress}}</h5>
        <p class="card-description">
          Nº de Partidas: {{numPartidas}} <br>
          Nº de Victorias: {{numVictorias}} <br>
          Puntos: {{puntos}}
        </p>

        <md-button class="md-round md-success" type="submit" :data-background-color="dataBackgroundColor" @click="confirmarEliminar = true" >Dar de baja</md-button>
      </md-card-content>
    </md-card>
    
  </div>
</template>
<script>
import { environment as env } from '@/environments/environment'
export default {
  name: 'user-card',
  props: {
    cardUserImage: {
      type: String,
      default: require('@/assets/img/logoImagen.png')
    },
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
      numPartidas: null,
      numVictorias: null,
      puntos: null,
      confirmarEliminar: false
    }
  },
  beforeMount () {
    this.info()
  },
  methods: {
    showmodal () {
      this.$modal.show('confirmacion')
    },
    info () {
      let url = env.apiBaseUrl+'/usuario/info/' + this.$session.get('idusuario') + ''
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
    dardebaja () {
      let url = env.apiBaseUrl+'/usuario/dardebaja/' + this.$session.get('idusuario') + ''
      this.$http.post(url)
        .then(response => {
          if (response.status === 200) {
            this.$session.destroy()
            this.$router.push('/')
            this.$emit('logueado',false)
            //location.reload()
          }
        })
    }

  }
}

</script>
<style>

</style>
