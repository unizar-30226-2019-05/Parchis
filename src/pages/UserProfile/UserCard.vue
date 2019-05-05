<template>
  <div>
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

        <md-button class="md-round md-success" type="submit" :data-background-color="dataBackgroundColor" @click="showmodal" >Dar de baja</md-button>
      </md-card-content>
    </md-card>
    <modal name="confirmacion" :draggable="true" :resizable="true">
     <h2>
       <span>
         ¿Está seguro de que quiere dar de baja su perfil?
       </span>
        <h3 class="text-danger text-center">
          No podrá volver a conectarse en esta cuenta.
        </h3>
      </h2>
      <md-button class="md-round md-danger" type="submit" @click="dardebaja" >Dar de baja</md-button>
    </modal>
  </div>
</template>
<script>

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
      puntos: null
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
    dardebaja () {
      let url = '54.37.157.166:3306/api/usuario/dardebaja/' + this.$session.get('idusuario') + ''
      this.$http.post(url)
        .then(response => {
          if (response.status === 200) {
            this.$session.destroy()
            this.$router.push('/')
            location.reload()
          }
        })
    }

  }
}

</script>
<style>

</style>
