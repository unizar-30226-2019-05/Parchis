<template>
  <form>
    <md-dialog-alert
      :md-active.sync="errores.exist"
      :md-title= "errores.title"
      :md-content= "errores.msg" />
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Login</h4>
        <p class="category">login your profile</p>
      </md-card-header>
      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-55">
            <md-field>
              <label>Email Address</label>
              <md-input v-model="emailadress" type="email"></md-input>
            </md-field>
            <md-field>
              <label>PassWord</label>
              <md-input v-model="password" type="PassWord"></md-input>
            </md-field>
            
          </div>
          <div class="md-layout-item md-size-100 text-left">
            <md-button class="md-raised" type="submit" @click="handleSubmit" :data-background-color="dataBackgroundColor">Login</md-button>
            <router-link :to="{path:'/signin'}">
              <md-button class="md-raised" type="submit" :data-background-color="dataBackgroundColor">Registrarse</md-button>
            </router-link>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>
<script>
export default {
  name: 'login-form',
  props: {
    dataBackgroundColor: {
      type: String,
      default: 'blue'
    }
  },
  data () {
    return {
      emailadress: null,
      password: null,
      errores: {
        exist: false,
        title: '',
        msg: ''
      }
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      let url = 'http://localhost:3000/api/usuario/login'
      this.$http.post(url, {
        emailadress: this.emailadress,
        password: this.password
      })
        .then(response => {
          if (response.status === 200) {
            this.$session.start()
            this.$session.set('idusuario', response.data['nombreUsuario'])
            this.$session.set('name', response.data['nombreCompleto'])
            this.$router.push('/newgame')
            location.reload()
          }else{
            this.errores.title = 'Error'
            this.errores.msg = 'Vuelva a intentarlo, ha ocurrido un error'
            this.errores.exist = true
          }
        })
    }
  }
}

</script>
<style>

</style>
