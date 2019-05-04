<template>
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Registro</h4>
        <p class="category">Complete los campos necesarios</p>
      </md-card-header>
      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Nickname</label>
              <md-input v-model="nickname" type="text" required autofocus></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Email Address</label>
              <md-input v-model="emailadress" type="email"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Nombre y apellidos</label>
              <md-input v-model="name" type="text"></md-input>
            </md-field>
          </div>
          
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>clave de acceso</label>
              <md-input v-model="pass" type="password"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Repetir clave de acceso</label>
              <md-input v-model="passrepet" type="password"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100 text-left">
            <md-button class="md-raised md-success" type="submit" @click="handleSubmit" :data-background-color="dataBackgroundColor"> Registrarse </md-button>
          </div>
          <div class="md-layout-item md-size-100 text-left">
             <router-link :to="{path:'/login'}">Si está registrado, haga login clickando aquí.</router-link>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>
<script>
export default {
  name: 'signin-form',
  props: {
    dataBackgroundColor: {
      type: String,
      default: 'blue'
    }
  },
  data () {
    return {
      nickname: null,
      name: null,
      emailadress: null,
      pass: null,
      passrepet: null,
      
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      if (this.pass === this.passrepet && this.pass.length > 0) {
        let url = '54.37.157.166:3306/api/usuario/register'
        this.$http.post(url, {
          nickname: this.nickname,
          name: this.name,
          emailadress: this.emailadress,
          pass: this.pass,
          passrepet: this.passrepet          
        })
          .then(response => {            
            this.$router.push('/login')
          })
      }
    },
  }
}

</script>
<style>

</style>
