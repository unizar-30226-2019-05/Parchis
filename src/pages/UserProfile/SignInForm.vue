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
              <md-input v-model="nickname" type="text"></md-input>
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
import { environment as env } from '@/environments/environment'
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
  created(){
    for(let i=0;i<5;i++){
      this.validar.push({mostrar:false,error:false,msg:''})
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()

      //verificación de campos front-end
      let camposCorrectos = true
      if(!this.validacion(this.validar[0],this.nickname !== '','Nickname correcto.',
      'Nickname incorrecto.')) camposCorrectos = false
      if(!this.validacion(this.validar[1],this.emailadress.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
      'Correo correcto.','Correo incorrecto, ejemplo: admin@example.com')) camposCorrectos = false
      if(!this.validacion(this.validar[2],this.name.match(/^[A-Za-z\u00C0-\u017F][A-Za-z\u00C0-\u017F ]*$/),
      'Nombre correcto.','Nombre incorrecto: solo debe contener espacios y letras.')) camposCorrectos = false
      if(!this.validacion(this.validar[3],this.pass.match(/^(?=.*[a-z])(?=.*\d)(?=.{8,})/),
      'Contraseña correcta.','Contraseña incorrecta: debe contener al menos 8 carácteres, letras y números.')) camposCorrectos=false
      if(!this.validacion(this.validar[4],this.passrepet === this.pass,'Confirmación de contraseña correcta.',
      'Confirmación incorrecta: debe ser igual a la contraseña nueva.')) camposCorrectos=false
      if(!camposCorrectos) return



      let url = env.apiBaseUrl+'/usuario/existeUsuario'
      this.$http.post(url, {
        nickname: this.nickname,
        emailadress: this.emailadress          
      })
        .then(response => {
          if (response.status === 200) { // NO EXISTEN TODAVIA
            if (this.pass === this.passrepet && this.pass.length > 0) {
              let url = env.apiBaseUrl+'/usuario/register'
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
    validacion(v,validate,ok,nok){
      v.mostrar = true
      if(validate){
        v.msg = ok
        v.error = false
        return true
      }else{
        v.msg = nok
        v.error = true
        return false
      }
    }
  },
  watch: {
    nickname: function(value){
      let ok= 'Nickname correcto.'
      let nok = 'Nickname incorrecto.'
      this.validacion(this.validar[0],value !== '',ok,nok)
    },
    emailadress: function(value){
      let ok= 'Correo correcto.'
      let nok = 'Correo incorrecto, ejemplo: admin@example.com'
      this.validacion(this.validar[1],value.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),ok,nok)
    },
    name: function(value){
      let ok= 'Nombre correcto.'
      let nok = 'Nombre incorrecto: solo debe contener espacios y letras.'
      this.validacion(this.validar[2],value.match(/^[A-Za-z\u00C0-\u017F][A-Za-z\u00C0-\u017F ]*$/),ok,nok)
    },
    pass: function(value){
      let ok= 'Contraseña correcta.'
      let nok = 'Contraseña incorrecta: debe contener al menos 8 carácteres, letras y números.'
      this.validacion(this.validar[3],value.match(/^(?=.*[a-z])(?=.*\d)(?=.{8,})/),ok,nok)
    },
    passrepet: function(value){
      let ok= 'Confirmación de contraseña correcta.'
      let nok = 'Confirmación incorrecta: debe ser igual a la contraseña nueva.'
      this.validacion(this.validar[4],value === this.pass,ok,nok)
    },
  }
}

</script>
<style>
.md-valid{
  color: rgba(0,128,0,1) !important;
}
</style>
