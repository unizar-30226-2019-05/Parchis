<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-100">
       <md-card class="md-card-profile">
        <div class="md-card-avatar">
          <img class="img" :src="url_avatar">
        </div>
        <md-card-content>
          <h6 class="category text-gray">{{username}}</h6>
          <h4 class="card-title"> {{emailadress}}</h4>
          <p class="card-description">
            Nº de Partidas: {{numPartidas}} <br>
            Nº de Victorias: {{numVictorias}} <br>
            Puntos: {{puntos}}
          </p>
          <md-button class="md-raised" data-background-color="blue" type="submit" @click="comprobar()">
            <i class="material-icons"> games</i>  Añadir amigo
          </md-button>
        </md-card-content>
      </md-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: null,
      emailadress: null
    }
  },
  beforeMount () {
    this.info()
  },
  methods: {
    info () {
      var idusuario = this.$route.query.perfil
      console.log('Veamos que perfil busca = ' + idusuario)
      let url = 'http://localhost:3000/api/usuario/info/' + idusuario + ''
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
    comprobar() {
      let url = 'http://localhost:3000/api/usuario/comprobar/' + this.$session.get('idusuario') + '/' + this.$route.query.perfil
      this.$http.post(url)
        .then(response => {
          if (response.status === 200) { 
            console.log('Ahora debería añadir')          
            this.anyadir()
            console.log('Ya añadido')
          } else if (response.status === 201) {
            alert("Ya son amigos o ya existe una solicitud pendiente.")
          }
        })
    },

    anyadir() {
      console.log('Entra al metodo añadir')
      let url = 'http://localhost:3000/api/usuario/anyadir/' + this.$session.get('idusuario') + '/' + this.$route.query.perfil
      console.log(this.$session.get('idusuario'))
      console.log(this.$route.query.perfil)
      this.$http.post(url)
        .then(response => {            
          this.$router.go('/user')
        })
    }
  }
}
</script>
