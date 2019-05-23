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
            <md-field :class="validar[0].mostrar ? 'md-invalid' : ''">
              <label>Nickname</label>
              <md-input v-model="nickname" type="text" required autofocus></md-input>
              <span class="md-error" :class="!validar[0].error ? 'md-valid' : ''">{{validar[0].msg}}</span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field :class="validar[1].mostrar ? 'md-invalid' : ''">
              <label>Correo electrónico</label>
              <md-input v-model="emailadress" type="email"></md-input>
              <span class="md-error" :class="!validar[1].error ? 'md-valid' : ''">{{validar[1].msg}}</span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field :class="validar[2].mostrar ? 'md-invalid' : ''">
              <label>Nombre y apellidos</label>
              <md-input v-model="name" type="text"></md-input>
              <span class="md-error" :class="!validar[2].error ? 'md-valid' : ''">{{validar[2].msg}}</span>
            </md-field>
          </div>
          
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field :class="validar[3].mostrar ? 'md-invalid' : ''">
              <label>Contraseña</label>
              <md-input v-model="pass" type="password"></md-input>
              <span class="md-error" :class="!validar[3].error ? 'md-valid' : ''">{{validar[3].msg}}</span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field :class="validar[4].mostrar ? 'md-invalid' : ''">
              <label>Repetir contraseña</label>
              <md-input v-model="passrepet" type="password"></md-input>
              <span class="md-error" :class="!validar[4].error ? 'md-valid' : ''">{{validar[4].msg}}</span>
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
      sha512: require('crypto-js/sha512'),
      nickname: null,
      name: null,
      emailadress: null,
      pass: null,
      passrepet: null,
      errores: {
        exist: false,
        title: '',
        msg: ''
      },
      validar: []
    }
  },
  mounted(){
    for(let i=0;i<5;i++){
      this.validar.push({mostrar:false,error:false,msg:''})
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
                pass: this.sha512(this.pass).toString(),
                passrepet: this.sha512(this.passrepet).toString()          
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
  },
  watch: {
    nickname: function(value){
      this.validar[0].mostrar = true
      if(value.match(/^[A-Za-z\u00C0-\u017F][A-Za-z\u00C0-\u017F ]*$/)){
        this.validar[0].msg = 'nickname correcto'
        this.validar[0].error = false
      }else{
        this.validar[0].msg = 'nickname incorrecto: debe contener kajkjashfkj'
        this.validar[0].error = true
      }
      
    },
    name: function(value){
      this.validar[2].mostrar = true
      if(value.match(/^[A-Za-z\u00C0-\u017F][A-Za-z\u00C0-\u017F ]*$/)){
        this.validar[2].msg = 'name correcto'
        this.validar[2].error = false
      }else{
        this.validar[2].msg = 'name incorrecto: debe contener kajkjashfkj'
        this.validar[2].error = true
      }
      
    },
    emailadress: function(value){
      this.validar[1].mostrar = true
      if(value.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
        this.validar[1].msg = 'email correcto'
        this.validar[1].error = false
      }else{
        this.validar[1].msg = 'email incorrecto: debe contener kajkjashfkj'
        this.validar[1].error = true
      }
      
    },
    pass: function(value){
      this.validar[3].mostrar = true
      if(value.match(/^(?=.*.[a-z])(?=.*\d)(?=.{8,})/)){
        this.validar[3].msg = 'pass correcto'
        this.validar[3].error = false
      }else{
        this.validar[3].msg = 'pass incorrecto: debe contener'
        this.validar[3].error = true
      }
      
    },
    passrepet: function(value){
      this.validar[4].mostrar = true
      if(value.match(/^(?=.*.[a-z])(?=.*\d)(?=.{8,})/)){
        this.validar[4].msg = 'pass repeat correcto'
        this.validar[4].error = false
      }else{
        this.validar[4].msg = 'pass repeat incorrecto: debe contener'
        this.validar[4].error = true
      }
    },
  }
}

</script>
<style>
.md-valid{
  color: rgba(0,128,0,1) !important;
}
</style>
