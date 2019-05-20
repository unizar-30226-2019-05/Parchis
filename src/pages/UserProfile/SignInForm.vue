<template>
  <form>
    <md-dialog-alert
      :md-active.sync="errores.exist"
      :md-title= "errores.title"
      :md-content= "errores.msg" />
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
              <label>Correo electrónico</label>
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
              <label>Contraseña</label>
              <md-input v-model="pass" type="password"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Repetir contraseña</label>
              <md-input v-model="passrepet" type="password"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100 text-left">
            <md-button class="md-raised md-success" type="submit" @click="handleSubmit" :data-background-color="dataBackgroundColor"> Registrarse </md-button>
          </div>
          <div class="md-layout-item md-size-100 text-left">
             <router-link :to="{path:'/login'}">Si ya está registrado, haga login clickando aquí.</router-link>
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
      let url = 'http://localhost:3000/api/usuario/existeUsuario'
      this.$http.post(url, {
        nickname: this.nickname,
        emailadress: this.emailadress          
      })
        .then(response => {
          if (response.status === 200) { // NO EXISTEN TODAVIA
            if (this.pass === this.passrepet && this.pass.length > 0) {
              let url = 'http://localhost:3000/api/usuario/register'
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
            else{
              this.errores.title = 'Error'
              this.errores.msg = 'Ha ocurrido un error con la contraseña, vuelva a intentarlo.'
              this.errores.exist = true
            }
          }
          else{
            this.errores.title = 'Error'
            this.errores.msg = 'Ya existe el nickname y/o el email, vuelva a intentarlo'
            this.errores.exist = true
            }
        })
    },
  }
}

</script>
<style>

</style>
